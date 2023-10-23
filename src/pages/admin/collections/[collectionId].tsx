import { useRouter } from "next/router";
import { NextPageWithLayout } from "@/pages/_app";
import LayoutAdmin from "@/components/layouts/admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EditCollectionForm from "@/components/interfaces/admin/edit-collection-form";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const collectionId = router.query.collectionId as string;

  const { data: collection } = trpc.admin.collections.getOne.useQuery(
    collectionId,
    {
      enabled: Boolean(collectionId),
    }
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex gap-2 items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Edit collection</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {collection ? (
            <EditCollectionForm collection={collection} />
          ) : (
            "Loading..."
          )}
        </CardContent>
      </Card>
    </>
  );
};

Page.getLayout = LayoutAdmin;

export default Page;
