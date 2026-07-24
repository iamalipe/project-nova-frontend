import { G as e, z as n, r as t } from "./dist-CcA4xCvU.js"
import {
  a as C,
  o as D,
  k as E,
  s as O,
  Zt as S,
  jt as T,
  Qt as _,
  Xt as b,
  A as c,
  E as d,
  M as f,
  P as g,
  O as h,
  t as k,
  C as l,
  N as m,
  Mt as p,
  $ as s,
  D as u,
  T as v,
  j as w,
  Yt as x,
  X as y,
} from "./index-CARPuDSl.js"
import { t as o } from "./plus-DlnVAEFW.js"
import { t as a, r as i, n as r } from "./search-input-Ffp-L872.js"
var A = e(),
  j = `/app/country`,
  M = `Country`,
  N = (e) => {
    let { dataTable: n, rawQuery: i } = e,
      s = i.data
    if (!s) throw Error(`Something wrong`)
    let c = S({ from: j }),
      l = _({ from: j }),
      { data: u } = x.auth.useGetCurrentUser(),
      d = u?.data?.role === `SUPERUSER`,
      f = async () => {
        await i.refetch()
      },
      m = async () => {
        let e = p(k, { dialog: M, mode: `CREATE` })
        e && c({ search: (t) => ({ ...t, ds: e }) })
      },
      h = async () => {
        let e = p(k, { dialog: M, mode: `VIEW-ALL` })
        e && c({ search: (t) => ({ ...t, ds: e }) })
      },
      g = async (e) => {
        c({ search: (t) => ({ ...t, search: e }) })
      },
      v = s.config || { search: !0, searchPlaceholder: `Search...` }
    return (0, A.jsxs)(`div`, {
      className: `flex flex-none justify-between`,
      children: [
        (0, A.jsxs)(`div`, {
          className: `flex gap-2`,
          children: [
            (0, A.jsx)(y, { variant: `outline` }),
            v.search &&
              (0, A.jsx)(a, {
                value: l.search,
                onChange: g,
                placeholder: v.searchPlaceholder,
              }),
          ],
        }),
        (0, A.jsxs)(`div`, {
          className: `flex gap-2`,
          children: [
            (0, A.jsx)(t, {
              title: `All Countries`,
              variant: `outline`,
              onClick: h,
              children: `All Countries`,
            }),
            d &&
              (0, A.jsx)(t, {
                title: `Create New`,
                size: `icon`,
                variant: `outline`,
                "data-testid": `create-new-button`,
                onClick: m,
                children: (0, A.jsx)(o, {}),
              }),
            (0, A.jsx)(T, {
              title: `Refresh`,
              variant: `outline`,
              onClick: f,
              "data-testid": `refresh-button`,
            }),
            (0, A.jsx)(r, { dataTable: n }),
          ],
        }),
      ],
    })
  },
  P = `/app/country`,
  F = ({ rawQuery: e }) => {
    let t = e.data
    if (!t) throw Error(`Something wrong`)
    let n = i(`country`),
      r = v({
        initialPageSize: t.pagination.limit,
        initialPageIndex: t.pagination.page,
        routeFrom: P,
      }),
      a = l({ initialSort: t.sort, routeFrom: P }),
      o = d({
        data: t.data,
        columns: C,
        rowCount: t.pagination.total,
        paginationState: r.state,
        columnVisibility: n.state,
        onToggleVisibilityChange: n.toggleVisibility,
        sortState: a.state,
        onPaginationChange: r.onPaginationChange,
        onSortingChange: a.onSortChange,
      })
    return (0, A.jsxs)(A.Fragment, {
      children: [
        (0, A.jsxs)(`main`, {
          className: `flex-1 overflow-hidden flex flex-col p-2 pl-0 gap-2`,
          children: [
            (0, A.jsx)(N, { rawQuery: e, dataTable: o }),
            (0, A.jsx)(h, {
              dataTable: o,
              contextMenu: (e) => (0, A.jsx)(D, { data: e }),
            }),
            (0, A.jsx)(u, { dataTable: o }),
            (0, A.jsx)(O, {}),
          ],
        }),
        (0, A.jsx)(b, {}),
      ],
    })
  },
  I = () =>
    (0, A.jsxs)(`main`, {
      className: `flex-1 overflow-hidden flex flex-col p-2 pl-0 gap-2 animate-pulse`,
      children: [
        (0, A.jsxs)(`div`, {
          className: `flex flex-none justify-between items-center`,
          children: [
            (0, A.jsxs)(`div`, {
              className: `flex items-center gap-2`,
              children: [
                (0, A.jsx)(s, { className: `h-10 w-10 border rounded-md` }),
                (0, A.jsx)(s, {
                  className: `h-10 w-48 md:w-64 border rounded-md`,
                }),
              ],
            }),
            (0, A.jsxs)(`div`, {
              className: `flex items-center gap-2`,
              children: [
                (0, A.jsx)(s, { className: `h-10 w-24 border rounded-md` }),
                (0, A.jsx)(s, { className: `h-10 w-10 border rounded-md` }),
                (0, A.jsx)(s, { className: `h-10 w-10 border rounded-md` }),
                (0, A.jsx)(s, { className: `h-10 w-10 border rounded-md` }),
              ],
            }),
          ],
        }),
        (0, A.jsxs)(E, {
          children: [
            (0, A.jsx)(m, {
              className: `z-10`,
              children: (0, A.jsxs)(g, {
                className: `border-b-0 table-header-box-shadow`,
                children: [
                  (0, A.jsx)(f, {
                    className: `w-10`,
                    children: (0, A.jsx)(s, { className: `h-4 w-4 rounded` }),
                  }),
                  (0, A.jsx)(f, { children: `Name` }),
                  (0, A.jsx)(f, { children: `Flag` }),
                  (0, A.jsx)(f, { children: `Code3` }),
                  (0, A.jsx)(f, { children: `Code2` }),
                  (0, A.jsx)(f, { children: `Timezone` }),
                  (0, A.jsx)(f, { children: `Currency3` }),
                  (0, A.jsx)(f, { children: `Currency Symbol` }),
                  (0, A.jsx)(f, { className: `w-10`, children: `Action` }),
                ],
              }),
            }),
            (0, A.jsx)(c, {
              children: Array.from({ length: 5 }).map((e, t) =>
                (0, A.jsxs)(
                  g,
                  {
                    children: [
                      (0, A.jsx)(w, {
                        className: `w-10`,
                        children: (0, A.jsx)(s, {
                          className: `h-4 w-4 rounded`,
                        }),
                      }),
                      (0, A.jsx)(w, {
                        className: `font-bold`,
                        children: (0, A.jsx)(s, { className: `h-4 w-32` }),
                      }),
                      (0, A.jsx)(w, {
                        children: (0, A.jsx)(s, { className: `h-4 w-8` }),
                      }),
                      (0, A.jsx)(w, {
                        children: (0, A.jsx)(s, { className: `h-4 w-12` }),
                      }),
                      (0, A.jsx)(w, {
                        children: (0, A.jsx)(s, { className: `h-4 w-10` }),
                      }),
                      (0, A.jsx)(w, {
                        children: (0, A.jsx)(s, { className: `h-4 w-24` }),
                      }),
                      (0, A.jsx)(w, {
                        children: (0, A.jsx)(s, { className: `h-4 w-12` }),
                      }),
                      (0, A.jsx)(w, {
                        children: (0, A.jsx)(s, { className: `h-4 w-8` }),
                      }),
                      (0, A.jsx)(w, {
                        className: `w-10`,
                        children: (0, A.jsx)(s, {
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
        (0, A.jsxs)(`div`, {
          className: `flex md:items-center md:flex-row flex-col justify-between px-2 py-1 flex-none gap-2`,
          children: [
            (0, A.jsx)(`div`, {
              className: `text-xs text-muted-foreground flex items-center`,
              children: (0, A.jsx)(s, { className: `h-4 w-44` }),
            }),
            (0, A.jsxs)(`div`, {
              className: `flex md:items-center gap-2`,
              children: [
                (0, A.jsx)(s, { className: `h-8 w-20 border rounded-md` }),
                (0, A.jsx)(s, { className: `h-8 w-32 border rounded-md` }),
              ],
            }),
          ],
        }),
      ],
    }),
  L = () => {
    let e = n(_({ from: `/app/country` }), [`ds`]),
      t = x.country.useGetAll(e)
    return t.isLoading
      ? (0, A.jsxs)(A.Fragment, {
          children: [(0, A.jsx)(I, {}), (0, A.jsx)(b, {})],
        })
      : (0, A.jsxs)(A.Fragment, {
          children: [(0, A.jsx)(F, { rawQuery: t }), (0, A.jsx)(b, {})],
        })
  }
export { L as default }
