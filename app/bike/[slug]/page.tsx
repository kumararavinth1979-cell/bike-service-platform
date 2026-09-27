import { notFound } from "next/navigation";
import { getBike } from "@/lib/data/bikes";
import { BikePage } from "@/components/BikePage";

export default async function BikeRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bike = getBike(slug);
  if (!bike) notFound();
  return <BikePage bike={bike} />;
}
