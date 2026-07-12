import type { ProductType } from "@/api/product-api";
import DataTable from "@/components/data-table/data-table";
import TableFooter from "@/components/data-table/table-footer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import apiQuery from "@/hooks/use-api-query";
import useQueryLoadingState from "@/hooks/use-query-loading-state";
import { useDataTable } from "@/hooks/use-data-table";
import usePaginationClientSide from "@/hooks/use-pagination-client-side";
import useSortClientSide from "@/hooks/use-sort-client-side";
import type { DialogStateType } from "@/routes/private-admin/private-admin-route";
import { useNavigate } from "@tanstack/react-router";
import tableColumns from "../table-columns";
import DialogSkeleton from "./dialog-skeleton";

export type ProductDialogProps = {
  state: DialogStateType;
  data?: ProductType[];
};
const ProductDialogAll = ({ state }: ProductDialogProps) => {
  // Intentionally not the route's search params: this dialog shows the full
  // product list (ignoring the main table's server-side sort/filter/page)
  // and instead sorts/paginates it client-side (see useSortClientSide /
  // usePaginationClientSide below). `limit: 100` is the API's max page size,
  // fetched as page 1 so the dialog has the largest single batch to work with.
  const productQuery = apiQuery.product.useGetAll({ page: 1, limit: 100 });
  const { isLoading } = useQueryLoadingState([productQuery]);

  if (isLoading) return <DialogSkeleton />;

  return <DialogMain state={state} data={productQuery?.data?.data} />;
};
export default ProductDialogAll;

const DialogMain = ({ data }: ProductDialogProps) => {
  const navigate = useNavigate();

  const onClose = () => {
    navigate({
      to: ".",
      search: (prev) => ({
        ...prev,
        ds: undefined,
      }),
    });
  };

  const sort = useSortClientSide({
    data: data || [],
  });

  const pagination = usePaginationClientSide({
    initialPageSize: 10,
    initialPageIndex: 0,
    data: sort.sortedData,
  });

  const dataTable = useDataTable({
    data: pagination.paginatedData,
    columns: tableColumns,
    rowCount: pagination.total,
    paginationState: pagination.state,
    sortState: sort.state,
    onPaginationChange: pagination.onPaginationChange,
    onSortingChange: sort.onSortChange,
  });

  return (
    <>
      <Dialog
        open={true}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DialogContent className="sm:max-w-[1200px] flex flex-col sm:max-h-[80vh] px-2 md:px-4 sm:px-6">
          <DialogHeader className="flex-none">
            <DialogTitle>All Products</DialogTitle>
            <DialogDescription>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Recusandae ipsum porro sapiente! Perferendis harum dolorem culpa
              perspiciatis incidunt labore laborum quae ratione at voluptatum.
              Nam porro delectus eos autem reiciendis?
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden flex flex-col gap-2 md:gap-4">
            <DataTable dataTable={dataTable} />
            <TableFooter dataTable={dataTable} />
          </div>
          {/* <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </>
  );
};
