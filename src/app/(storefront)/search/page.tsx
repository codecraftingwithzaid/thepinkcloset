import { getProducts } from '@/actions/product';
import { ProductCard } from '@/components/premium';

type ProductRecord = {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  images?: string[];
  tags?: string[];
  price: number;
  salePrice?: number;
  ratings?: number;
  reviewsCount?: number;
  stock?: number;
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const products = await getProducts();
  const productList = products as ProductRecord[];
  const query = q.trim().toLowerCase();
  const results = query
    ? productList.filter((product) => [product.title, product.shortDescription, product.description, ...(product.tags || [])].filter(Boolean).join(' ').toLowerCase().includes(query))
    : [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="mb-3 text-center text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">Search</p>
      <h1 className="text-center font-display text-4xl font-bold text-neutral-950">{query ? `Results for "${q}"` : 'Search the Boutique'}</h1>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {results.map((product) => (
          <ProductCard key={product._id} id={product._id} name={product.title} slug={product.slug} image={product.images?.[0] || ''} hoverImage={product.images?.[1]} price={product.salePrice || product.price} originalPrice={product.salePrice ? product.price : undefined} rating={product.ratings || 0} reviewCount={product.reviewsCount || 0} stock={product.stock} />
        ))}
      </div>
      {query && results.length === 0 && <p className="mt-10 text-center text-neutral-600">No pieces matched that search yet.</p>}
    </section>
  );
}
