import { useEffect, useState } from "react"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { Filter, RotateCcw } from "lucide-react"
import apiQuery from "@/hooks/use-api-query"
import { Button } from "@/components/ui/button"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"

const SUBCATEGORY_ROUTE_FROM = "/app/subcategory"

export const SubcategoryFilterSheet = () => {
  const navigate = useNavigate({ from: SUBCATEGORY_ROUTE_FROM })
  const searchParam = useSearch({ from: SUBCATEGORY_ROUTE_FROM })

  const [isOpen, setIsOpen] = useState(false)
  const [tempCategoryId, setTempCategoryId] = useState<string>("")

  // Sync state from URL when open changes or URL changes
  useEffect(() => {
    if (isOpen) {
      setTempCategoryId(searchParam.categoryId || "")
    }
  }, [isOpen, searchParam.categoryId])

  const categoriesQuery = apiQuery.category.useGetAll({ page: 0 })
  const categories = categoriesQuery.data?.data || []

  const activeFiltersCount = searchParam.categoryId ? 1 : 0

  const handleApply = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        categoryId: tempCategoryId || undefined,
        page: 1, // Reset pagination to first page
      }),
    })
    setIsOpen(false)
  }

  const handleReset = () => {
    setTempCategoryId("")
    navigate({
      search: (prev) => ({
        ...prev,
        categoryId: undefined,
        page: 1,
      }),
    })
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        render={
          <Button variant="outline" className="gap-2 relative">
            <Filter className="h-4 w-4" />
            Filter
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-background">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        }
      />
      <SheetContent side="right" className="sm:max-w-sm flex flex-col h-full">
        <SheetHeader className="border-b pb-4">
          <SheetTitle>Filter Subcategories</SheetTitle>
        </SheetHeader>

        <div className="flex-1 py-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">Category</label>
            <NativeSelect
              value={tempCategoryId}
              className="w-full"
              onChange={(e) => setTempCategoryId(e.target.value)}
            >
              <NativeSelectOption value="">All Categories</NativeSelectOption>
              {categories.map((c) => (
                <NativeSelectOption key={c.id} value={c.id}>
                  {c.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
        </div>

        <SheetFooter className="border-t pt-4 flex-row gap-2 mt-auto">
          <Button
            type="button"
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleReset}
            disabled={!searchParam.categoryId && !tempCategoryId}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={handleApply}
          >
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
