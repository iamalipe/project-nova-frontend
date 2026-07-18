import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const CountrySkeleton = () => {
  return (
    <main className="flex-1 overflow-hidden flex flex-col p-2 pl-0 gap-2 animate-pulse">
      {/* ActionControls Skeleton */}
      <div className="flex flex-none justify-between items-center">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 border rounded-md" />
          <Skeleton className="h-10 w-48 md:w-64 border rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-24 border rounded-md" />
          <Skeleton className="h-10 w-10 border rounded-md" />
          <Skeleton className="h-10 w-10 border rounded-md" />
          <Skeleton className="h-10 w-10 border rounded-md" />
        </div>
      </div>

      {/* DataTable Skeleton */}
      <Table>
        <TableHeader className="z-10">
          <TableRow className="border-b-0 table-header-box-shadow">
            <TableHead className="w-10">
              <Skeleton className="h-4 w-4 rounded" />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Flag</TableHead>
            <TableHead>Code3</TableHead>
            <TableHead>Code2</TableHead>
            <TableHead>Timezone</TableHead>
            <TableHead>Currency3</TableHead>
            <TableHead>Currency Symbol</TableHead>
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
                <Skeleton className="h-4 w-8" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-10" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-8" />
              </TableCell>
              <TableCell className="w-10">
                <Skeleton className="h-8 w-8 rounded-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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

export default CountrySkeleton;
