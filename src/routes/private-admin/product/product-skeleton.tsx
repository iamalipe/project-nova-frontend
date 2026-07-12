import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ProductSkeleton = () => {
  return (
    <main className="flex-1 overflow-hidden flex flex-col p-2 gap-2 animate-pulse">
      {/* ActionControls Skeleton */}
      <div className="flex flex-none justify-between items-center">
        {/* Left Side: Sidebar Trigger and Search */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 border rounded-md" />
          <Skeleton className="h-10 w-48 md:w-64 border rounded-md" />
        </div>
        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-24 border rounded-md" />
          <Skeleton className="h-10 w-10 border rounded-md" />
          <Skeleton className="h-10 w-10 border rounded-md" />
          <Skeleton className="h-10 w-10 border rounded-md" />
        </div>
      </div>

      {/* DataTable Desktop Skeleton */}
      <Table>
        <TableHeader className="z-10">
          <TableRow className="border-b-0 table-header-box-shadow">
            <TableHead className="w-10">
              <Skeleton className="h-4 w-4 rounded" />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="w-10">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell className="w-10">
                <Skeleton className="h-4 w-4 rounded" />
              </TableCell>
              <TableCell className="font-bold">
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-48" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell className="w-10">
                <Skeleton className="h-8 w-8 rounded-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* DataTable Mobile Skeleton */}
      <div className="flex flex-col md:hidden relative w-full overflow-auto flex-1 scrollbar-thin gap-2">
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="px-2 flex flex-col rounded-md border p-2"
          >
            {[
              { label: "Name", w: "w-32" },
              { label: "Category", w: "w-24" },
              { label: "Price", w: "w-16" },
              { label: "Description", w: "w-48" },
              { label: "Created At", w: "w-28" },
            ].map((col, index, arr) => (
              <div
                key={col.label}
                className={`p-2 flex ${arr.length - 1 !== index ? "border-b" : ""}`}
              >
                <div className="w-2/5 font-medium">{col.label}</div>
                <div className="w-3/5">
                  <Skeleton className={`h-4 ${col.w}`} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* TableFooter Skeleton */}
      <div className="flex md:items-center md:flex-row flex-col justify-between px-2 py-1 flex-none gap-2">
        <div className="text-xs text-muted-foreground flex items-center">
          <Skeleton className="h-4 w-44" />
        </div>
        <div className="flex md:items-center gap-2">
          <Skeleton className="h-8 w-20 border rounded-md" />
          <Skeleton className="h-8 w-32 border rounded-md" />
        </div>
      </div>
    </main>
  );
};

export default ProductSkeleton;
