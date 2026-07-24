import { G as e, z as i, Y as n, r, K as t } from "./dist-CcA4xCvU.js"
import {
  M as _,
  et as A,
  O as b,
  rt as B,
  T as C,
  $ as d,
  Zt as D,
  Yt as E,
  A as f,
  jt as F,
  It as g,
  E as h,
  tt as H,
  k as I,
  f as j,
  d as k,
  m as L,
  D as m,
  h as M,
  it as N,
  at as O,
  C as p,
  j as P,
  nt as R,
  Qt as S,
  Xt as T,
  Mt as v,
  t as V,
  X as w,
  P as x,
  N as y,
  p as z,
} from "./index-CARPuDSl.js"
import { t as u } from "./plus-DlnVAEFW.js"
import { n as a, t as o } from "./rotate-ccw-C7OTehJq.js"
import { r as c, t as l, n as s } from "./search-input-Ffp-L872.js"
var U = n(t(), 1),
  W = e(),
  G = `/app/subcategory`,
  K = () => {
    let e = D({ from: G }),
      t = S({ from: G }),
      [n, i] = (0, U.useState)(!1),
      [s, c] = (0, U.useState)(``)
    ;(0, U.useEffect)(() => {
      n && c(t.categoryId || ``)
    }, [n, t.categoryId])
    let l = E.category.useGetAll({ page: 0 }).data?.data || [],
      u = +!!t.categoryId
    return (0, W.jsxs)(A, {
      open: n,
      onOpenChange: i,
      children: [
        (0, W.jsx)(O, {
          render: (0, W.jsxs)(r, {
            variant: `outline`,
            className: `gap-2 relative`,
            children: [
              (0, W.jsx)(a, { className: `h-4 w-4` }),
              `Filter`,
              u > 0 &&
                (0, W.jsx)(`span`, {
                  className: `absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-background`,
                  children: u,
                }),
            ],
          }),
        }),
        (0, W.jsxs)(H, {
          side: `right`,
          className: `sm:max-w-sm flex flex-col h-full`,
          children: [
            (0, W.jsx)(B, {
              className: `border-b pb-4`,
              children: (0, W.jsx)(N, { children: `Filter Subcategories` }),
            }),
            (0, W.jsx)(`div`, {
              className: `flex-1 py-4 flex flex-col gap-4`,
              children: (0, W.jsxs)(`div`, {
                className: `flex flex-col gap-2`,
                children: [
                  (0, W.jsx)(`label`, {
                    className: `text-sm font-medium text-muted-foreground`,
                    children: `Category`,
                  }),
                  (0, W.jsxs)(L, {
                    value: s,
                    className: `w-full`,
                    onChange: (e) => c(e.target.value),
                    children: [
                      (0, W.jsx)(M, { value: ``, children: `All Categories` }),
                      l.map((e) =>
                        (0, W.jsx)(M, { value: e.id, children: e.name }, e.id)
                      ),
                    ],
                  }),
                ],
              }),
            }),
            (0, W.jsxs)(R, {
              className: `border-t pt-4 flex-row gap-2 mt-auto`,
              children: [
                (0, W.jsxs)(r, {
                  type: `button`,
                  variant: `outline`,
                  className: `flex-1 gap-2`,
                  onClick: () => {
                    ;(c(``),
                      e({
                        search: (e) => ({ ...e, categoryId: void 0, page: 1 }),
                      }),
                      i(!1))
                  },
                  disabled: !t.categoryId && !s,
                  children: [(0, W.jsx)(o, { className: `h-4 w-4` }), `Reset`],
                }),
                (0, W.jsx)(r, {
                  type: `button`,
                  className: `flex-1`,
                  onClick: () => {
                    ;(e({
                      search: (e) => ({
                        ...e,
                        categoryId: s || void 0,
                        page: 1,
                      }),
                    }),
                      i(!1))
                  },
                  children: `Apply Filters`,
                }),
              ],
            }),
          ],
        }),
      ],
    })
  },
  q = `/app/subcategory`,
  J = `Subcategory`,
  Y = (e) => {
    let { dataTable: t, rawQuery: n } = e,
      i = n.data
    if (!i) throw Error(`Something wrong`)
    let a = D({ from: q }),
      o = S({ from: q }),
      { data: c } = E.auth.useGetCurrentUser(),
      d = c?.data?.role === `SUPERUSER`,
      f = async () => {
        await n.refetch()
      },
      p = async () => {
        let e = v(V, { dialog: J, mode: `CREATE` })
        e && a({ search: (t) => ({ ...t, ds: e }) })
      },
      m = async () => {
        let e = v(V, { dialog: J, mode: `IMPORT` })
        e && a({ search: (t) => ({ ...t, ds: e }) })
      },
      h = async () => {
        let e = v(V, { dialog: J, mode: `VIEW-ALL` })
        e && a({ search: (t) => ({ ...t, ds: e }) })
      },
      _ = async (e) => {
        a({ search: (t) => ({ ...t, search: e }) })
      },
      y = i.config || { search: !0, searchPlaceholder: `Search...` }
    return (0, W.jsxs)(`div`, {
      className: `flex flex-none justify-between`,
      children: [
        (0, W.jsxs)(`div`, {
          className: `flex gap-2`,
          children: [
            (0, W.jsx)(w, { variant: `outline` }),
            y.search &&
              (0, W.jsx)(l, {
                value: o.search,
                onChange: _,
                placeholder: y.searchPlaceholder,
              }),
            (0, W.jsx)(K, {}),
          ],
        }),
        (0, W.jsxs)(`div`, {
          className: `flex gap-2`,
          children: [
            (0, W.jsx)(r, {
              title: `All Subcategories`,
              variant: `outline`,
              onClick: h,
              children: `All Subcategories`,
            }),
            d &&
              (0, W.jsxs)(W.Fragment, {
                children: [
                  (0, W.jsx)(r, {
                    title: `Create New`,
                    size: `icon`,
                    variant: `outline`,
                    "data-testid": `create-new-button`,
                    onClick: p,
                    children: (0, W.jsx)(u, {}),
                  }),
                  (0, W.jsx)(r, {
                    title: `Import CSV`,
                    size: `icon`,
                    variant: `outline`,
                    onClick: m,
                    children: (0, W.jsx)(g, {}),
                  }),
                ],
              }),
            (0, W.jsx)(F, {
              title: `Refresh`,
              variant: `outline`,
              onClick: f,
              "data-testid": `refresh-button`,
            }),
            (0, W.jsx)(s, { dataTable: t }),
          ],
        }),
      ],
    })
  },
  X = `/app/subcategory`,
  Z = ({ rawQuery: e }) => {
    let t = e.data
    if (!t) throw Error(`Something wrong`)
    let n = c(`subcategory`),
      r = C({
        initialPageSize: t.pagination.limit,
        initialPageIndex: t.pagination.page,
        routeFrom: X,
      }),
      i = p({ initialSort: t.sort, routeFrom: X }),
      a = h({
        data: t.data,
        columns: k,
        rowCount: t.pagination.total,
        paginationState: r.state,
        columnVisibility: n.state,
        onToggleVisibilityChange: n.toggleVisibility,
        sortState: i.state,
        onPaginationChange: r.onPaginationChange,
        onSortingChange: i.onSortChange,
      })
    return (0, W.jsxs)(W.Fragment, {
      children: [
        (0, W.jsxs)(`main`, {
          className: `flex-1 overflow-hidden flex flex-col p-2 pl-0 gap-2`,
          children: [
            (0, W.jsx)(Y, { rawQuery: e, dataTable: a }),
            (0, W.jsx)(b, {
              dataTable: a,
              contextMenu: (e) => (0, W.jsx)(j, { data: e }),
            }),
            (0, W.jsx)(m, { dataTable: a }),
            (0, W.jsx)(z, {}),
          ],
        }),
        (0, W.jsx)(T, {}),
      ],
    })
  },
  Q = () =>
    (0, W.jsxs)(`main`, {
      className: `flex-1 overflow-hidden flex flex-col p-2 pl-0 gap-2 animate-pulse`,
      children: [
        (0, W.jsxs)(`div`, {
          className: `flex flex-none justify-between items-center`,
          children: [
            (0, W.jsxs)(`div`, {
              className: `flex items-center gap-2`,
              children: [
                (0, W.jsx)(d, { className: `h-10 w-10 border rounded-md` }),
                (0, W.jsx)(d, {
                  className: `h-10 w-48 md:w-64 border rounded-md`,
                }),
              ],
            }),
            (0, W.jsxs)(`div`, {
              className: `flex items-center gap-2`,
              children: [
                (0, W.jsx)(d, { className: `h-10 w-24 border rounded-md` }),
                (0, W.jsx)(d, { className: `h-10 w-10 border rounded-md` }),
                (0, W.jsx)(d, { className: `h-10 w-10 border rounded-md` }),
                (0, W.jsx)(d, { className: `h-10 w-10 border rounded-md` }),
              ],
            }),
          ],
        }),
        (0, W.jsxs)(I, {
          children: [
            (0, W.jsx)(y, {
              className: `z-10`,
              children: (0, W.jsxs)(x, {
                className: `border-b-0 table-header-box-shadow`,
                children: [
                  (0, W.jsx)(_, {
                    className: `w-10`,
                    children: (0, W.jsx)(d, { className: `h-4 w-4 rounded` }),
                  }),
                  (0, W.jsx)(_, { children: `Name` }),
                  (0, W.jsx)(_, { children: `Category` }),
                  (0, W.jsx)(_, { children: `SKU` }),
                  (0, W.jsx)(_, { children: `Description` }),
                  (0, W.jsx)(_, { children: `Created At` }),
                  (0, W.jsx)(_, { className: `w-10`, children: `Action` }),
                ],
              }),
            }),
            (0, W.jsx)(f, {
              children: Array.from({ length: 5 }).map((e, t) =>
                (0, W.jsxs)(
                  x,
                  {
                    children: [
                      (0, W.jsx)(P, {
                        className: `w-10`,
                        children: (0, W.jsx)(d, {
                          className: `h-4 w-4 rounded`,
                        }),
                      }),
                      (0, W.jsx)(P, {
                        className: `font-bold`,
                        children: (0, W.jsx)(d, { className: `h-4 w-32` }),
                      }),
                      (0, W.jsx)(P, {
                        children: (0, W.jsx)(d, { className: `h-4 w-24` }),
                      }),
                      (0, W.jsx)(P, {
                        children: (0, W.jsx)(d, { className: `h-4 w-12` }),
                      }),
                      (0, W.jsx)(P, {
                        children: (0, W.jsx)(d, { className: `h-4 w-48` }),
                      }),
                      (0, W.jsx)(P, {
                        children: (0, W.jsx)(d, { className: `h-4 w-28` }),
                      }),
                      (0, W.jsx)(P, {
                        className: `w-10`,
                        children: (0, W.jsx)(d, {
                          className: `h-8 w-8 rounded-full`,
                        }),
                      }),
                    ],
                  },
                  t
                )
              ),
            }),
          ],
        }),
        (0, W.jsxs)(`div`, {
          className: `flex md:items-center md:flex-row flex-col justify-between px-2 py-1 flex-none gap-2`,
          children: [
            (0, W.jsx)(`div`, {
              className: `text-xs text-muted-foreground flex items-center`,
              children: (0, W.jsx)(d, { className: `h-4 w-44` }),
            }),
            (0, W.jsxs)(`div`, {
              className: `flex md:items-center gap-2`,
              children: [
                (0, W.jsx)(d, { className: `h-8 w-20 border rounded-md` }),
                (0, W.jsx)(d, { className: `h-8 w-32 border rounded-md` }),
              ],
            }),
          ],
        }),
      ],
    }),
  $ = () => {
    let e = i(S({ from: `/app/subcategory` }), [`ds`]),
      t = E.subcategory.useGetAll(e)
    return t.isLoading
      ? (0, W.jsxs)(W.Fragment, {
          children: [(0, W.jsx)(Q, {}), (0, W.jsx)(T, {})],
        })
      : (0, W.jsxs)(W.Fragment, {
          children: [(0, W.jsx)(Z, { rawQuery: t }), (0, W.jsx)(T, {})],
        })
  }
export { $ as default }
