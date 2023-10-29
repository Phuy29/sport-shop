import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/router";

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
import { Icons } from "@/components/icons";

import { RouterOutputs, trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Must be at least 1 character",
  }),
});

type Inputs = z.infer<typeof formSchema>;

interface EditCollectionFormProps {
  collection: RouterOutputs["admin"]["collections"]["getOne"];
}

export default function EditCollectionForm({
  collection,
}: EditCollectionFormProps) {
  const router = useRouter();

  const editCollectionMutation = trpc.admin.collections.update.useMutation({
    onSuccess: async () => {
      toast.success("Collection updated!");
      router.push("/admin/collections");
    },
    onError: async (err) => {
      toast.error(err.message);
    },
  });

  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: collection.name,
    },
  });

  async function onSubmit(data: Inputs) {
    console.log({ data });

    editCollectionMutation.mutate({
      id: collection.id,
      name: data.name,
    });
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full max-w-2xl gap-5"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input
              aria-invalid={!!form.formState.errors.name}
              placeholder="Type collection name here."
              {...form.register("name")}
            />
          </FormControl>
          <UncontrolledFormMessage
            message={form.formState.errors.name?.message}
          />
        </FormItem>

        <Button
          type="submit"
          className="w-fit"
          disabled={editCollectionMutation.isLoading}
        >
          {editCollectionMutation.isLoading && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Edit Collection
          <span className="sr-only">Edit Collection</span>
        </Button>
      </form>
    </Form>
  );
}
