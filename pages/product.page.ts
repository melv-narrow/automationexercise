import { expect, Locator, Page } from '@playwright/test';

const categoryRoutes: Record<string, Record<string, string>> = {
  Women: {
    Dress: '/category_products/1',
    Tops: '/category_products/2',
    Saree: '/category_products/7',
  },
  Men: {
    Tshirts: '/category_products/3',
    Jeans: '/category_products/6',
  },
  Kids: {
    Dress: '/category_products/4',
    'Tops & Shirts': '/category_products/5',
  },
} as const;

class ProductPage {
  page: Page;
  productLink: Locator;
  allProductsHeading: Locator;
  searchProduct: Locator;
  searchButton: Locator;
  categoryHeader: Locator;
  cartModal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productLink = page.locator("a[href='/products']");
    this.allProductsHeading = page.getByRole('heading', { name: 'All Products' });
    this.searchProduct = page.getByPlaceholder('Search Product');
    this.searchButton = page.locator('#submit_search');
    this.categoryHeader = page.locator('.title.text-center').first();
    this.cartModal = page.locator('#cartModal');
  }

  private productCardById(productId: number) {
    return this.page
      .locator('.features_items .product-image-wrapper')
      .filter({ has: this.page.locator(`a[href='/product_details/${productId}']`) })
      .first();
  }

  productCardByName(productName: string) {
    return this.page
      .locator('.features_items .product-image-wrapper')
      .filter({ hasText: productName })
      .first();
  }

  async navigateToProductPage() {
    await this.page.goto('/products');
    await expect(this.allProductsHeading).toBeVisible();
  }

  async openFirstProduct() {
    await this.page.locator(".features_items a[href^='/product_details/']").first().click();
  }

  async openProductById(productId: number) {
    await this.page.locator(`a[href='/product_details/${productId}']`).first().click();
  }

  async verifyProductDetails() {
    await expect(this.page.getByRole('heading', { name: 'Blue Top' })).toBeVisible();
    await expect(this.page.getByText('Category: Women > Tops')).toBeVisible();
    await expect(this.page.getByText('Rs. 500')).toBeVisible();
    await expect(this.page.getByText('Availability: In Stock')).toBeVisible();
    await expect(this.page.getByText('Condition: New')).toBeVisible();
    await expect(this.page.getByText('Brand: Polo')).toBeVisible();
  }

  async searchForProduct(productName: string) {
    await this.searchProduct.fill(productName);
    await this.searchButton.click();
    await expect(this.productCardByName(productName)).toBeVisible();
  }

  async navigateToCategory(mainCategory: keyof typeof categoryRoutes, subCategory: string) {
    const route = categoryRoutes[mainCategory][subCategory];
    await this.page.goto(route);
    await expect(this.categoryHeader).toBeVisible();
  }

  async addProductToCart(productId: number) {
    const card = this.productCardById(productId);

    await card.scrollIntoViewIfNeeded();
    await card.locator('.productinfo a.add-to-cart').click();
    await expect(this.cartModal).toBeVisible();
  }
}

export default ProductPage;
