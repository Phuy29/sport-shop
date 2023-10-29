import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { isArrayOfFile } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UncontrolledFormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { OurFileRouter } from "@/server/uploadthing";
import { FileDialog, FileWithPreview } from "./file-dialog";
import { Product } from "@/types/admin";
import { z } from "zod";
import { RouterOutputs, trpc } from "@/utils/trpc";
import { Zoom } from "./zoom-image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { ProductOptions } from "./product-options-form";
import { ProductVariants } from "./product-variants-form";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Must be at least 1 character",
  }),
  description: z.string(),
  collectionId: z.string().min(1, {
    message: "Must be at least 1 character",
  }),
  images: z.unknown(),
  options: z.array(
    z.object({
      name: z.string().min(1, { message: "Must be at least 1 character" }),
      values: z.array(z.string()),
    })
  ),
  variants: z.array(
    z.object({
      name: z.string(),
      price: z.number(),
      inventory: z.number(),
      options: z.array(z.object({ name: z.string(), value: z.string() })),
    })
  ),
});

type Inputs = z.infer<typeof formSchema> & { images: string[] };

interface UpdateProductFormProps {
  product: RouterOutputs["admin"]["products"]["getOne"];
}

export function UpdateProductForm({ product }: UpdateProductFormProps) {
  const router = useRouter();
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null);

  const { data } = trpc.admin.collections.get.useQuery();

  const deleteProductMutation = trpc.admin.products.delete.useMutation({
    onSuccess: () => {
      toast.success("Product deleted!");
      router.push(`/admin/products`);
    },
  });

  const updateProductMutation = trpc.admin.products.update.useMutation({
    onSuccess: () => {
      toast.success("Product updated!");
      router.push(`/admin/products`);
    },
  });

  React.useEffect(() => {
    if (product.images && product.images.length > 0) {
      setFiles(
        product.images.map((image) => {
          const file = new File([], image.url, {
            type: "image",
          });
          const fileWithPreview = Object.assign(file, {
            preview: image.url,
          });

          return fileWithPreview;
        })
      );
    }
  }, [product]);

  const { isUploading, startUpload } = useUploadThing("imageUploader");

  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collectionId: product.collectionId ?? undefined,
      options: product.options.map((option) => ({
        name: option.name,
        values: Array.from(new Set(option.optionValue.map((val) => val.value))),
      })),
      variants: product.variants.map((variant) => ({
        name: variant.name,
        price: variant.price,
        inventory: variant.inventory,
        options: variant.optionValue.map((option) => ({
          name: product.options.find((x) => x.id === option.optionId)?.name,
          value: option.value,
        })),
      })),
    },
  });

  async function onSubmit(data: Inputs) {
    const images = isArrayOfFile(data.images)
      ? await startUpload(data.images).then((res) => {
          const formattedImages = res?.map((image) => ({
            id: image.key,
            name: image.key.split("_")[1] ?? image.key,
            url: image.url,
          }));
          return formattedImages ?? null;
        })
      : null;

    updateProductMutation.mutate({
      id: product.id,
      name: data.name,
      description: data.description,
      collectionId: data.collectionId,
      images: images?.map((item) => item.url) ?? [],
      options: data.options,
      variants: data.variants,
    });
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full max-w-4xl mx-auto gap-5"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <Separator />

        <div>
          <h1 className="font-semibold text-lg">General information</h1>
          <p className="text-sm text-slate-500 mb-4">
            To start selling, all you need is a name and a price.
          </p>

          <div className="space-y-4">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  aria-invalid={!!form.formState.errors.name}
                  placeholder="Type product name here."
                  {...form.register("name")}
                  defaultValue={product.name}
                />
              </FormControl>
              <UncontrolledFormMessage
                message={form.formState.errors.name?.message}
              />
            </FormItem>

            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type product description here."
                  {...form.register("description")}
                  defaultValue={product.description ?? ""}
                />
              </FormControl>
              <UncontrolledFormMessage
                message={form.formState.errors.description?.message}
              />
            </FormItem>

            <FormField
              control={form.control}
              name="collectionId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Collection</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value: typeof field.value) =>
                        field.onChange(value)
                      }
                    >
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder={field.value} />
                      </SelectTrigger>
                      <SelectContent>
                        {data?.collections.map((collection) => (
                          <SelectItem key={collection.id} value={collection.id}>
                            {collection.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div>
          <h1 className="font-semibold text-lg">Variants</h1>
          <p className="text-sm text-slate-500 mb-4">
            Add variations of this product.
          </p>

          <ProductOptions />

          <ProductVariants />
        </div>

        <Separator />

        <div>
          <h1 className="font-semibold text-lg">Image</h1>
          <p className="text-sm text-slate-500 mb-4">
            Add images to this product.
          </p>
          <FormItem className="flex w-full flex-col gap-1.5">
            <FormLabel>Images</FormLabel>
            {files?.length ? (
              <div className="flex items-center gap-2">
                {files.map((file, i) => (
                  <Zoom key={i}>
                    <Image
                      src={file.preview}
                      alt={file.name}
                      className="h-20 w-20 shrink-0 rounded-md object-cover object-center"
                      width={80}
                      height={80}
                    />
                  </Zoom>
                ))}
              </div>
            ) : null}
            <FormControl>
              <FileDialog
                setValue={form.setValue}
                name="images"
                maxFiles={3}
                maxSize={1024 * 1024 * 4}
                files={files}
                setFiles={setFiles}
                isUploading={isUploading}
              />
            </FormControl>
            <UncontrolledFormMessage
              message={form.formState.errors.images?.message}
            />
          </FormItem>
        </div>

        <div className="flex space-x-2">
          <Button disabled={updateProductMutation.isLoading}>
            {updateProductMutation.isLoading && (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Update Product
            <span className="sr-only">Update product</span>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                Delete Product
                <span className="sr-only">Delete product</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={deleteProductMutation.isLoading}
                  onClick={() => {
                    deleteProductMutation.mutate(product.id);
                  }}
                >
                  {deleteProductMutation.isLoading && (
                    <Icons.spinner
                      className="mr-2 h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                  )}
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </form>
    </Form>
  );
}
