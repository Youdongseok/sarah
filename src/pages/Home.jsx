const stack = [
  { label: 'React', value: 'UI library' },
  { label: 'Vite', value: 'Fast dev server' },
  { label: 'Tailwind', value: 'Utility-first CSS' },
  { label: 'Router', value: 'Client-side navigation' },
]

function HomePage() {
  return (
    <section className="grid gap-6 md:grid-cols-[1.25fr_1fr]">
      <article className="rounded-3xl border border-slate-200 bg-white/85 p-7 shadow-xl shadow-slate-200/60 backdrop-blur">
        <h2 className="text-2xl font-extrabold text-slate-900">
          바로 개발 시작
        </h2>
        <p className="mt-3 text-slate-600">
          이제 이 프로젝트는 Tailwind 스타일링과 React Router 페이지 전환이
          기본으로 연결된 상태예요. 컴포넌트만 추가하면 바로 작업할 수 있어요.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
            npm run dev
          </span>
          <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">
            npm run build
          </span>
        </div>
      </article>

      <aside className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
        <h3 className="text-lg font-bold text-slate-900">현재 구성</h3>
        <ul className="mt-4 space-y-3">
          {stack.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"
            >
              <span className="font-semibold text-slate-800">{item.label}</span>
              <span className="text-sm text-slate-500">{item.value}</span>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  )
}

export default HomePage
