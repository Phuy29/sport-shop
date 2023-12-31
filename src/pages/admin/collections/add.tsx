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
      <Card>
        <CardHeader>
          <div className="flex gap-2 items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Add collection</CardTitle>
          </div>
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
