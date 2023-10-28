import { NextPageWithLayout } from "@/pages/_app";
import LayoutAdmin from "@/components/layouts/admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AddCollectionForm from "@/components/interfaces/admin/add-collection-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";

const Page: NextPageWithLayout = () => {
  const router = useRouter();

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
          <CardTitle>Add collection</CardTitle>
        </CardHeader>
        <CardContent>
          <AddCollectionForm />
        </CardContent>
      </Card>
    </>
  );
};

Page.getLayout = LayoutAdmin;

export default Page;
