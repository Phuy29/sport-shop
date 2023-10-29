import { cn, createUrl } from "@/lib/utils";
import { RouterOutputs } from "@/utils/trpc";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function VariantSelector({
  options,
  variants,
}: {
  options: RouterOutputs["store"]["products"]["getOne"]["options"];
  variants: RouterOutputs["store"]["products"]["getOne"]["variants"];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!options.length) {
    return null;
  }

  return options.map((option) => (
    <dl className="mb-8" key={option.id}>
      <dt className="mb-4 text-sm uppercase tracking-wide">{option.name}</dt>
      <dd className="flex flex-wrap gap-3">
        {option.optionValue.map((item) => {
          const value = item.value;
          const optionNameLowerCase = option.name.toLowerCase();

          const optionSearchParams = new URLSearchParams(
            searchParams.toString()
          );

          optionSearchParams.set(optionNameLowerCase, value);
          const optionUrl = createUrl(pathname, optionSearchParams);

          const isActive = searchParams.get(optionNameLowerCase) === value;

          return (
            <button
              key={value}
              onClick={() => {
                router.replace(optionUrl, { scroll: false });
              }}
              title={`${option.name} ${value}`}
              className={cn(
                "flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900",
                {
                  "cursor-default ring-2 ring-blue-600": isActive,
                }
              )}
            >
              {value}
            </button>
          );
        })}
      </dd>
    </dl>
  ));
}
