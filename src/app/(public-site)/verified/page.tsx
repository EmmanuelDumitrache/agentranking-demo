import { VerifiedPage } from "@/components/verified/verified-page";
import { readVerifiedDirectoryPage } from "@/lib/agent-directory/verified-directory.server";



export default async function VerifiedRoutePage() {
  const initialData = await readVerifiedDirectoryPage();
  return <VerifiedPage initialData={initialData} />;
}
