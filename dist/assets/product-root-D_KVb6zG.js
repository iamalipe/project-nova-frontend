import { G as e, z as i, Y as n, r, K as t } from "./dist-CcA4xCvU.js"
import {
  Qt as _,
  m as A,
  Xt as b,
  at as C,
  C as d,
  it as D,
  h as E,
  D as f,
  u as F,
  O as g,
  Mt as h,
  nt as j,
  l as k,
  It as m,
  rt as M,
  t as N,
  jt as O,
  E as p,
  tt as P,
  Zt as S,
  et as T,
  T as v,
  c as w,
  Yt as x,
  X as y,
} from "./index-CARPuDSl.js"
import { t as u } from "./plus-DlnVAEFW.js"
import { t as I } from "./product-skeleton-BwmRBU33.js"
import { n as a, t as o } from "./rotate-ccw-C7OTehJq.js"
import { r as c, t as l, n as s } from "./search-input-Ffp-L872.js"
var L = n(t(), 1),
  R = e(),
  z = `/app/product`,
  B = () => {
    let e = S({ from: z }),
      t = _({ from: z }),
      [n, i] = (0, L.useState)(!1),
      [s, c] = (0, L.useState)(``),
      [l, u] = (0, L.useState)(``),
      d = x.category.useGetAll({ page: 0 }),
      f = x.subcategory.useGetAll({ page: 0 }),
      p = d.data?.data || [],
      m = f.data?.data || []
    ;(0, L.useEffect)(() => {
      n && (c(t.categoryId || ``), u(t.subcategoryId || ``))
    }, [n, t.categoryId, t.subcategoryId])
    let h = (0, L.useMemo)(
        () => (s ? m.filter((e) => e.categoryId === s) : m),
        [m, s]
      ),
      g = (e) => {
        ;(c(e), e && (m.some((t) => t.id === l && t.categoryId === e) || u(``)))
      },
      v = +!!t.categoryId + +!!t.subcategoryId,
      y = () => {
        ;(e({
          search: (e) => ({
            ...e,
            categoryId: s || void 0,
            subcategoryId: l || void 0,
            page: 1,
          }),
        }),
          i(!1))
      },
      b = () => {
        ;(c(``),
          u(``),
          e({
            search: (e) => ({
              ...e,
              categoryId: void 0,
              subcategoryId: void 0,
              page: 1,
            }),
          }),
          i(!1))
      },
      w = !t.categoryId && !t.subcategoryId && !s && !l
    return (0, R.jsxs)(T, {
      open: n,
      onOpenChange: i,
      children: [
        (0, R.jsx)(C, {
          render: (0, R.jsxs)(r, {
            variant: `outline`,
            className: `relative gap-2`,
            children: [
              (0, R.jsx)(a, { className: `h-4 w-4` }),
              `Filter`,
              v > 0 &&
                (0, R.jsx)(`span`, {
                  className: `absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-primary text-[10px] font-bold text-primary-foreground`,
                  children: v,
                }),
            ],
          }),
        }),
        (0, R.jsxs)(P, {
          side: `right`,
          className: `flex h-full flex-col sm:max-w-sm`,
          children: [
            (0, R.jsx)(M, {
              className: `border-b pb-4`,
              children: (0, R.jsx)(D, { children: `Filter Products` }),
            }),
            (0, R.jsxs)(`div`, {
              className: `flex flex-1 flex-col gap-4 px-4`,
              children: [
                (0, R.jsxs)(`div`, {
                  className: `flex flex-col gap-2`,
                  children: [
                    (0, R.jsx)(`label`, {
                      className: `text-sm font-medium text-muted-foreground`,
                      children: `Category`,
                    }),
                    (0, R.jsxs)(A, {
                      value: s,
                      className: `w-full`,
                      onChange: (e) => g(e.target.value),
                      children: [
                        (0, R.jsx)(E, {
                          value: ``,
                          children: `All Categories`,
                        }),
                        p.map((e) =>
                          (0, R.jsx)(E, { value: e.id, children: e.name }, e.id)
                        ),
                      ],
                    }),
                  ],
                }),
                (0, R.jsxs)(`div`, {
                  className: `flex flex-col gap-2`,
                  children: [
                    (0, R.jsx)(`label`, {
                      className: `text-sm font-medium text-muted-foreground`,
                      children: `Subcategory`,
                    }),
                    (0, R.jsxs)(A, {
                      value: l,
                      className: `w-full`,
                      onChange: (e) => u(e.target.value),
                      children: [
                        (0, R.jsx)(E, {
                          value: ``,
                          children: `All Subcategories`,
                        }),
                        h.map((e) =>
                          (0, R.jsx)(E, { value: e.id, children: e.name }, e.id)
                        ),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            (0, R.jsxs)(j, {
              className: `mt-auto flex-row gap-2 border-t pt-4`,
              children: [
                (0, R.jsxs)(r, {
                  type: `button`,
                  variant: `outline`,
                  className: `flex-1 gap-2`,
                  onClick: b,
                  disabled: w,
                  children: [(0, R.jsx)(o, { className: `h-4 w-4` }), `Reset`],
                }),
                (0, R.jsx)(r, {
                  type: `button`,
                  className: `flex-1`,
                  onClick: y,
                  children: `Apply Filters`,
                }),
              ],
            }),
          ],
        }),
      ],
    })
  },
  V = `/app/product`,
  H = `Product`,
  U = (e) => {
    let { dataTable: t, rawQuery: n } = e,
      i = n.data
    if (!i) throw Error(`Something wrong`)
    let a = S({ from: V }),
      o = _({ from: V }),
      { data: c } = x.auth.useGetCurrentUser(),
      d = c?.data?.role === `SUPERUSER`,
      f = async () => {
        await n.refetch()
      },
      p = async () => {
        let e = h(N, { dialog: H, mode: `CREATE` })
        e && a({ search: (t) => ({ ...t, ds: e }) })
      },
      g = async () => {
        let e = h(N, { dialog: H, mode: `IMPORT` })
        e && a({ search: (t) => ({ ...t, ds: e }) })
      },
      v = async () => {
        let e = h(N, { dialog: H, mode: `VIEW-ALL` })
        e && a({ search: (t) => ({ ...t, ds: e }) })
      },
      b = async (e) => {
        a({ search: (t) => ({ ...t, search: e }) })
      },
      C = i.config || { search: !0, searchPlaceholder: `Search...` }
    return (0, R.jsxs)(`div`, {
      className: `flex flex-none justify-between`,
      children: [
        (0, R.jsxs)(`div`, {
          className: `flex gap-2`,
          children: [
            (0, R.jsx)(y, { variant: `outline` }),
            C.search &&
              (0, R.jsx)(l, {
                value: o.search,
                onChange: b,
                placeholder: C.searchPlaceholder,
              }),
            (0, R.jsx)(B, {}),
          ],
        }),
        (0, R.jsxs)(`div`, {
          className: `flex gap-2`,
          children: [
            (0, R.jsx)(r, {
              title: `All Products`,
              variant: `outline`,
              onClick: v,
              children: `All Products`,
            }),
            d &&
              (0, R.jsxs)(R.Fragment, {
                children: [
                  (0, R.jsx)(r, {
                    title: `Create New`,
                    size: `icon`,
                    variant: `outline`,
                    "data-testid": `create-new-button`,
                    onClick: p,
                    children: (0, R.jsx)(u, {}),
                  }),
                  (0, R.jsx)(r, {
                    title: `Import CSV`,
                    size: `icon`,
                    variant: `outline`,
                    onClick: g,
                    children: (0, R.jsx)(m, {}),
                  }),
                ],
              }),
            (0, R.jsx)(O, {
              title: `Refresh`,
              variant: `outline`,
              onClick: f,
              "data-testid": `refresh-button`,
            }),
            (0, R.jsx)(s, { dataTable: t }),
          ],
        }),
      ],
    })
  },
  W = `/app/product`,
  G = ({ rawQuery: e }) => {
    let t = e.data
    if (!t) throw Error(`Something wrong`)
    let n = c(`product`),
      r = v({
        initialPageSize: t.pagination.limit,
        initialPageIndex: t.pagination.page,
        routeFrom: W,
      }),
      i = d({ initialSort: t.sort, routeFrom: W }),
      a = p({
        data: t.data,
        columns: w,
        rowCount: t.pagination.total,
        paginationState: r.state,
        columnVisibility: n.state,
        onToggleVisibilityChange: n.toggleVisibility,
        sortState: i.state,
        onPaginationChange: r.onPaginationChange,
        onSortingChange: i.onSortChange,
      })
    return (0, R.jsxs)(R.Fragment, {
      children: [
        (0, R.jsxs)(`main`, {
          className: `flex-1 overflow-hidden flex flex-col p-2 pl-0 gap-2`,
          children: [
            (0, R.jsx)(U, { rawQuery: e, dataTable: a }),
            (0, R.jsx)(g, {
              dataTable: a,
              contextMenu: (e) => (0, R.jsx)(k, { data: e }),
            }),
            (0, R.jsx)(f, { dataTable: a }),
            (0, R.jsx)(F, {}),
          ],
        }),
        (0, R.jsx)(b, {}),
      ],
    })
  },
  K = () => {
    let e = i(_({ from: `/app/product` }), [`ds`, `categoryId`]),
      t = x.product.useGetAll(e)
    return t.isLoading
      ? (0, R.jsxs)(R.Fragment, {
          children: [(0, R.jsx)(I, {}), (0, R.jsx)(b, {})],
        })
      : (0, R.jsxs)(R.Fragment, {
          children: [(0, R.jsx)(G, { rawQuery: t }), (0, R.jsx)(b, {})],
        })
  }
export { K as default }
