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
      <Button
        variant="ghost"
        className="items-center"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Collections
      </Button>

      <Card className="mt-2">
        <CardHeader>
          <CardTitle>Edit collection</CardTitle>
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
