import fs from "fs/promises";
import path from "path";
import { Product } from "@/types/catalog";

// Paths to static JSON files
const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_PATH = path.join(DATA_DIR, "products.json");
const BRANDS_PATH = path.join(DATA_DIR, "brands.json");
const CATEGORIES_PATH = path.join(DATA_DIR, "categories.json");

export interface Brand {
  id: string;
  name: string;
  origin: string;
  description: string;
  logo_url: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  product_count: number;
}

// Read JSON helper
async function readJsonFile<T>(filePath: string): Promise<T> {
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content) as T;
}

// Fetch all products
export async function getProducts(): Promise<Product[]> {
  try {
    return await readJsonFile<Product[]>(PRODUCTS_PATH);
  } catch (error) {
    console.error("Error reading products.json:", error);
    return [];
  }
}

// Fetch single product by slug (id)
export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  const found = products.find((p) => p.id === id);
  return found || null;
}

// Fetch all brands
export async function getBrands(): Promise<Brand[]> {
  try {
    return await readJsonFile<Brand[]>(BRANDS_PATH);
  } catch (error) {
    console.error("Error reading brands.json:", error);
    return [];
  }
}

// Fetch all categories
export async function getCategories(): Promise<Category[]> {
  try {
    return await readJsonFile<Category[]>(CATEGORIES_PATH);
  } catch (error) {
    console.error("Error reading categories.json:", error);
    return [];
  }
}
