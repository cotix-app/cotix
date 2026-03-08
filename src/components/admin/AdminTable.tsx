import { useState } from "react";

type Column = {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
};

type Props = {
  columns: Column[];
  data: any[];
};

export default function AdminTable({ columns, data }: Props) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const pageSize = 50;

  /* FILTRO */

  const filtered = data.filter((row) =>
    Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase()),
  );

  /* ORDENAMIENTO */

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;

    const A = a[sortKey];
    const B = b[sortKey];

    if (A === undefined || B === undefined) return 0;

    if (typeof A === "number" && typeof B === "number") {
      return sortDir === "asc" ? A - B : B - A;
    }

    return sortDir === "asc"
      ? String(A).localeCompare(String(B))
      : String(B).localeCompare(String(A));
  });

  /* PAGINACIÓN */

  const totalPages = Math.ceil(sorted.length / pageSize);

  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  /* SORT */

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  /* FORMATO */

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return "-";

    if (typeof value === "number") return value.toLocaleString();

    if (value === "aprobado") {
      return (
        <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded text-xs">
          aprobado
        </span>
      );
    }

    if (value === "rechazado") {
      return (
        <span className="bg-red-600/20 text-red-400 px-2 py-1 rounded text-xs">
          rechazado
        </span>
      );
    }

    return value;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl">
      {/* BUSCADOR */}

      <div className="p-4 border-b border-slate-800 flex flex-wrap items-center gap-4">
        <input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-800 px-4 py-2 rounded text-sm w-full md:w-64 text-gray-200"
        />

        <span className="text-xs text-gray-400 md:ml-auto">
          {sorted.length} resultados
        </span>
      </div>

      {/* TABLA */}

      <div className="w-full overflow-x-auto">
        <table className="min-w-[720px] w-full text-sm">
          <thead className="bg-slate-800 text-gray-300 uppercase text-xs sticky top-0">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className={`px-6 py-4 cursor-pointer select-none ${
                    col.align === "center"
                      ? "text-center"
                      : col.align === "right"
                        ? "text-right"
                        : "text-left"
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {paginated.map((row, i) => (
              <tr key={i} className="hover:bg-slate-800/70 transition">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-6 py-4 text-gray-300 whitespace-nowrap ${
                      col.align === "center"
                        ? "text-center"
                        : col.align === "right"
                          ? "text-right"
                          : "text-left"
                    }`}
                  >
                    {formatValue(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}

      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-800 flex justify-between items-center text-sm">
          <span className="text-gray-400">
            Página {page} de {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 bg-slate-800 rounded disabled:opacity-40"
            >
              Anterior
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 bg-slate-800 rounded disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
