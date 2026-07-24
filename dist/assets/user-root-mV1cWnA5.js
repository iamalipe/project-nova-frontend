import {
  z as a,
  G as e,
  r as i,
  Y as n,
  n as r,
  K as t,
} from "./dist-CcA4xCvU.js"
import {
  Mt as _,
  Zt as A,
  R as b,
  z as B,
  St as C,
  D as d,
  Xt as D,
  X as E,
  E as f,
  vt as F,
  L as g,
  I as h,
  wt as I,
  b as j,
  Z as k,
  C as l,
  x as L,
  Ft as m,
  bt as M,
  jt as N,
  Yt as O,
  F as p,
  t as P,
  xt as R,
  S,
  Tt as T,
  Ct as u,
  O as v,
  T as w,
  Rt as x,
  Qt as y,
  y as z,
} from "./index-CARPuDSl.js"
import { t as V } from "./product-skeleton-BwmRBU33.js"
import { t as c, n as o, r as s } from "./search-input-Ffp-L872.js"
var H = e(),
  U = `/app/user`,
  W = (e) => {
    let { dataTable: t, rawQuery: n } = e,
      r = n.data
    if (!r) throw Error(`Something wrong`)
    let i = A({ from: U }),
      a = y({ from: U }),
      s = async () => {
        await n.refetch()
      },
      l = async (e) => {
        i({ search: (t) => ({ ...t, search: e }) })
      },
      u = r.config || { search: !0, searchPlaceholder: `Search...` }
    return (0, H.jsxs)(`div`, {
      className: `flex flex-none justify-between`,
      children: [
        (0, H.jsxs)(`div`, {
          className: `flex gap-2`,
          children: [
            (0, H.jsx)(E, { variant: `outline` }),
            u.search &&
              (0, H.jsx)(c, {
                value: a.search,
                onChange: l,
                placeholder: u.searchPlaceholder,
              }),
          ],
        }),
        (0, H.jsxs)(`div`, {
          className: `flex gap-2`,
          children: [
            (0, H.jsx)(N, {
              title: `Refresh`,
              variant: `outline`,
              onClick: s,
              "data-testid": `refresh-button`,
            }),
            (0, H.jsx)(o, { dataTable: t }),
          ],
        }),
      ],
    })
  },
  G = n(t(), 1),
  K = (e) => {
    let t = A({ from: `/app/user` }),
      { data: n } = O.auth.useGetCurrentUser(),
      i = n?.data
    return {
      onView: async () => {
        let n = _(P, { dialog: `User`, id: e.id, mode: `VIEW` })
        n && t({ search: (e) => ({ ...e, ds: n }) })
      },
      onDelete: async () => {
        if ((await L.delete()).response)
          try {
            let t = await O.user.delete(e.id)
            t.success && r.success(t.message || `Record Deleted`)
          } catch (e) {
            r.error(e.response?.data?.message || `Failed to delete user`)
          }
      },
      isSUPERUSER: i?.role === `SUPERUSER`,
      isSelf: i?.id === e.id,
    }
  },
  q = ({ data: e }) => {
    let t = k(),
      { onView: n, onDelete: r, isSUPERUSER: a, isSelf: o } = K(e),
      s = a && !o
    return t
      ? (0, H.jsxs)(`div`, {
          className: `flex gap-2`,
          children: [
            (0, H.jsx)(i, {
              onClick: n,
              size: `sm`,
              variant: `outline`,
              children: `View`,
            }),
            s &&
              (0, H.jsx)(i, {
                onClick: r,
                size: `sm`,
                variant: `destructive`,
                children: `Delete`,
              }),
          ],
        })
      : (0, H.jsxs)(F, {
          children: [
            (0, H.jsx)(T, {
              render: (0, H.jsx)(i, {
                size: `icon`,
                variant: `outline`,
                children: (0, H.jsx)(x, {}),
              }),
            }),
            (0, H.jsx)(M, {
              children: (0, H.jsxs)(R, {
                children: [
                  (0, H.jsx)(u, { children: `Action` }),
                  (0, H.jsx)(I, {}),
                  (0, H.jsx)(C, { onClick: n, children: `View` }),
                  s &&
                    (0, H.jsx)(C, {
                      className: `text-destructive`,
                      onClick: r,
                      children: `Delete`,
                    }),
                ],
              }),
            }),
          ],
        })
  },
  J = ({ data: e }) => {
    let { onView: t, onDelete: n, isSUPERUSER: r, isSelf: i } = K(e)
    return (0, H.jsx)(p, {
      children: (0, H.jsxs)(h, {
        children: [
          (0, H.jsx)(b, { children: `Action` }),
          (0, H.jsx)(B, {}),
          (0, H.jsx)(g, { onClick: t, children: `View` }),
          r &&
            !i &&
            (0, H.jsx)(g, {
              className: `text-destructive`,
              onClick: n,
              children: `Delete`,
            }),
        ],
      }),
    })
  },
  Y = ({ data: e, type: t = `row` }) => {
    let { isRowSelect: n, toggleRowSelect: r, selectedRows: i } = z(`user`),
      { data: a } = O.auth.useGetCurrentUser(),
      o = a?.data,
      s = o?.role === `SUPERUSER`,
      c = e ? o?.id === e.id : !1,
      l = (e && c) || !s,
      u = t === `header` && i.length > 0 ? `indeterminate` : e ? n(e.id) : !1,
      d = u === `indeterminate`,
      f = !d && u
    return l && t === `row`
      ? (0, H.jsx)(j, {
          checked: !1,
          disabled: !0,
          "aria-label": `Select row disabled`,
          className: `translate-y-[2px]`,
        })
      : (0, H.jsx)(j, {
          checked: f,
          indeterminate: d,
          onCheckedChange: () => {
            t === `row` && e && !l && r(e.id)
          },
          "aria-label": t === `header` ? `Select All` : `Select row`,
          className: `translate-y-[2px]`,
        })
  },
  X = () => {
    let { selectedRows: e, clearRowSelect: t } = z(`user`)
    return (
      (0, G.useEffect)(
        () => () => {
          t()
        },
        []
      ),
      e.length === 0
        ? null
        : (0, H.jsxs)(`div`, {
            className: `fixed bottom-8 left-1/2 flex -translate-x-1/2 gap-2 rounded-md border bg-muted p-2 text-muted-foreground shadow-xl drop-shadow-lg`,
            children: [
              (0, H.jsxs)(`div`, {
                className: `flex items-center gap-2 pl-2`,
                children: [
                  e.length,
                  ` Selected`,
                  (0, H.jsx)(i, {
                    onClick: () => {
                      t()
                    },
                    title: `Clear selection`,
                    variant: `outline`,
                    size: `icon-sm`,
                    children: (0, H.jsx)(m, {}),
                  }),
                ],
              }),
              (0, H.jsx)(i, {
                onClick: async () => {
                  if ((await L.delete()).response)
                    try {
                      let n = await O.user.deleteMany(e)
                      ;(t(),
                        r.success(
                          n.message || `${n.data.count} record(s) deleted`
                        ))
                    } catch {
                      r.error(`Failed to delete selected records`)
                    }
                },
                title: `Delete selected`,
                size: `sm`,
                variant: `destructive`,
                children: `Delete`,
              }),
            ],
          })
    )
  },
  Z = [
    {
      key: `select`,
      label: `Select`,
      labelRender: () => (0, H.jsx)(Y, { type: `header` }),
      isSortable: !1,
      isHidable: !1,
      render: (e) => (0, H.jsx)(Y, { type: `row`, data: e }),
      classNameHeader: `w-10`,
      classNameRow: `w-10`,
    },
    {
      label: `First Name`,
      key: `firstName`,
      render: (e) => e.firstName,
      isSortable: !0,
      classNameRow: `font-bold`,
    },
    {
      label: `Last Name`,
      key: `lastName`,
      render: (e) => e.lastName || `-`,
      isSortable: !0,
    },
    { label: `Email`, key: `email`, render: (e) => e.email, isSortable: !0 },
    {
      label: `Role`,
      key: `role`,
      render: (e) =>
        (0, H.jsx)(`span`, {
          className: `px-2 py-1 rounded text-xs font-semibold ${e.role === `SUPERUSER` ? `bg-primary text-primary-foreground` : `bg-muted text-muted-foreground`}`,
          children: e.role,
        }),
      isSortable: !0,
    },
    {
      label: `Created At`,
      key: `createdAt`,
      render: (e) => S(e.createdAt),
      isSortable: !0,
    },
    {
      label: `Action`,
      key: `action`,
      render: (e) => (0, H.jsx)(q, { data: e }),
      isSortable: !1,
      classNameHeader: `w-10`,
      classNameRow: `w-10`,
    },
  ],
  Q = `/app/user`,
  $ = ({ rawQuery: e }) => {
    let t = e.data
    if (!t) throw Error(`Something wrong`)
    let n = s(`user`),
      r = w({
        initialPageSize: t.pagination.limit,
        initialPageIndex: t.pagination.page,
        routeFrom: Q,
      }),
      i = l({ initialSort: t.sort, routeFrom: Q }),
      a = f({
        data: t.data,
        columns: Z,
        rowCount: t.pagination.total,
        paginationState: r.state,
        columnVisibility: n.state,
        onToggleVisibilityChange: n.toggleVisibility,
        sortState: i.state,
        onPaginationChange: r.onPaginationChange,
        onSortingChange: i.onSortChange,
      })
    return (0, H.jsxs)(H.Fragment, {
      children: [
        (0, H.jsxs)(`main`, {
          className: `flex-1 overflow-hidden flex flex-col p-2 pl-0 gap-2`,
          children: [
            (0, H.jsx)(W, { rawQuery: e, dataTable: a }),
            (0, H.jsx)(v, {
              dataTable: a,
              contextMenu: (e) => (0, H.jsx)(J, { data: e }),
            }),
            (0, H.jsx)(d, { dataTable: a }),
            (0, H.jsx)(X, {}),
          ],
        }),
        (0, H.jsx)(D, {}),
      ],
    })
  },
  ee = () => {
    let e = a(y({ from: `/app/user` }), [`ds`]),
      t = O.user.useGetAll(e)
    return t.isLoading
      ? (0, H.jsxs)(H.Fragment, {
          children: [(0, H.jsx)(V, {}), (0, H.jsx)(D, {})],
        })
      : (0, H.jsxs)(H.Fragment, {
          children: [(0, H.jsx)($, { rawQuery: t }), (0, H.jsx)(D, {})],
        })
  }
export { ee as default }
