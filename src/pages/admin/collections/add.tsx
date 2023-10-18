import { NextPageWithLayout } from "@/pages/_app";
import LayoutAdmin from "@/components/layouts/admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Add collection</CardTitle>
          <CardDescription>Add a new collection to your store</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </>
  );
};

Page.getLayout = LayoutAdmin;

export default Page;
