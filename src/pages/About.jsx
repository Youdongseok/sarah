function AboutPage() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/85 p-7 shadow-xl shadow-slate-200/60 backdrop-blur">
      <h2 className="text-2xl font-extrabold text-slate-900">About Route</h2>
      <p className="mt-3 text-slate-600">
        이 페이지는 라우팅 동작 확인용 예시예요. `src/pages`에 파일을 추가하고
        `src/App.jsx`에서 Route만 연결하면 페이지를 확장할 수 있어요.
      </p>
      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
        <p className="font-mono text-sm text-slate-700">
          {'<Route path="/new" element={<NewPage />} />'}
        </p>
      </div>
    </section>
  )
}

export default AboutPage
