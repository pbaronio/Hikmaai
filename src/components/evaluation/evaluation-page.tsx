"use client";

import { useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { evaluations } from "@/lib/data/mock";
import {
  TableColumnHeader,
  evaluationColumnHints,
} from "@/components/shared/table-column-header";
import { neutralChipClassName } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

const ALL_CATEGORIES = "all";

export function EvaluationPageContent() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(ALL_CATEGORIES);

  const categories = useMemo(() => {
    return [...new Set(evaluations.map((e) => e.category))].sort();
  }, []);

  const filtered = useMemo(() => {
    return evaluations.filter((item) => {
      if (categoryFilter !== ALL_CATEGORIES && item.category !== categoryFilter)
        return false;

      if (!search.trim()) return true;

      const q = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.preset.toLowerCase().includes(q)
      );
    });
  }, [search, categoryFilter]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="page-title">Evaluation</h1>
        <Button className="create-new-btn shrink-0">
          Create new
          <Plus className="size-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search evaluations..."
            className="search-field pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <Select
            value={categoryFilter}
            onValueChange={(v) => setCategoryFilter(v ?? ALL_CATEGORIES)}
          >
            <SelectTrigger className="w-[188px] border-border bg-card">
              <span className="truncate text-sm">
                {categoryFilter === ALL_CATEGORIES
                  ? "All categories"
                  : categoryFilter}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_CATEGORIES}>All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="surface-card overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <p className="stat-label">
            {filtered.length} evaluation{filtered.length === 1 ? "" : "s"}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-muted-foreground">
            No evaluations match your filters.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>
                  <TableColumnHeader label="Name" hint={evaluationColumnHints.name} />
                </TableHead>
                <TableHead>
                  <TableColumnHeader label="Category" hint={evaluationColumnHints.category} />
                </TableHead>
                <TableHead>
                  <TableColumnHeader label="Preset" hint={evaluationColumnHints.preset} />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-border hover:bg-accent/40"
                >
                  <TableCell>
                    <span className="text-[14px] font-medium text-foreground">
                      {item.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex rounded-md border px-2.5 py-0.5 text-[12px] font-medium",
                        neutralChipClassName
                      )}
                    >
                      {item.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-[14px] text-muted-foreground">
                      {item.preset}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
