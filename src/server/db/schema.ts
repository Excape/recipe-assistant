// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `ra_${name}`);

export const recipes = createTable(
  "recipe",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (recipe) => ({
    title: index("title_idx").on(recipe.title),
  }),
);

export const recipeIngredients = createTable(
  "ingredient",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    quantity: varchar("quantity", { length: 32 }),
    recipeId: integer("recipe_id")
      .notNull()
      .references(() => recipes.id),
  },
  (ingredient) => ({
    recipeId: index("recipe_id_idx").on(ingredient.recipeId),
  }),
);

export const recipesRelations = relations(recipes, ({ many }) => ({
  ingredients: many(recipeIngredients),
}));

export const recipeIngredientsRelations = relations(
  recipeIngredients,
  ({ one }) => ({
    recipe: one(recipes, {
      fields: [recipeIngredients.recipeId],
      references: [recipes.id],
    }),
  }),
);
