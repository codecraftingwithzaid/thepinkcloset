import React from 'react';
import {
  HeroSection,
  FeaturedCollectionsSection,
  TestimonialsSection,
  InstagramGallerySection,
  TrustBadgesSection,
} from '@/components/premium';
import { FeaturedProductsSection, TextBannerSection } from '@/components/premium/sections/ProductShowcase';
import { getBanners } from '@/actions/banner';
import { getCollections } from '@/actions/collection';
import { getProducts } from '@/actions/product';

type ProductRecord = {
  _id: string;
  title: string;
  slug: string;
  images?: string[];
  isActive?: boolean;
  price: number;
  salePrice?: number;
  ratings?: number;
  reviewsCount?: number;
  stock?: number;
  tags?: string[];
  isFeatured?: boolean;
};

type BannerRecord = {
  title?: string;
  subtitle?: string;
  image?: string;
  mobileImage?: string;
  link?: string;
  location?: string;
  ctaText?: string;
  ctaLink?: string;
  isActive?: boolean;
};

type CollectionRecord = {
  _id: string;
  title: string;
  slug: string;
  image?: string;
  featuredImage?: string;
  bannerImage?: string;
  isActive?: boolean;
  products?: string[];
};

export default async function StorefrontHomePage() {
  const [bannerResult, collectionResult, products] = await Promise.all([
    getBanners(),
    getCollections(),
    getProducts(),
  ]);

  const productList = products as ProductRecord[];
  const banners = bannerResult.success ? (bannerResult.data as BannerRecord[]).filter((banner) => banner.isActive) : [];
  const heroBanner = banners.find((banner) => banner.location === 'hero') ?? banners[0];
  const promoBanner = banners.find((banner) => banner.location === 'promo' || banner.location === 'announcement');
  const collections = collectionResult.success
    ? (collectionResult.data as CollectionRecord[])
        .filter((collection) => collection.isActive)
        .slice(0, 4)
        .map((collection) => ({
          id: collection._id,
          name: collection.title,
          image: collection.featuredImage || collection.image || collection.bannerImage || productList.find((product) => product.images?.[0])?.images?.[0],
          productCount: collection.products?.length ?? 0,
          href: `/shop?collection=${collection.slug}`,
        }))
    : [];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <HeroSection banner={heroBanner} fallbackProduct={productList.find((product) => product.images?.[0])} />
        <FeaturedCollectionsSection collections={collections} />
        <TrustBadgesSection />
        <FeaturedProductsSection products={productList.filter((product) => product.isActive).slice(0, 12)} />
        <TextBannerSection
          title={promoBanner?.title || 'Designed for the Modern Woman'}
          description={promoBanner?.subtitle || 'Every piece is thoughtfully curated from your live catalog to blend timeless elegance with contemporary comfort.'}
          ctaLabel={promoBanner?.ctaText || 'Learn Our Story'}
          ctaHref={promoBanner?.ctaLink || promoBanner?.link || '/about'}
          backgroundColor="from-pink-100 via-rose-50 to-pink-50"
        />

        <TestimonialsSection />
        <InstagramGallerySection />
      </main>
    </div>
  );
}
