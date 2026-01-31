import type { Certificate } from "@/lib/types/certificate";

export default async function CertificateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
}

const CertificateDetailPageContent = (certificate: Certificate) => {};

const LoadingCertificateDetailPage = () => {};
