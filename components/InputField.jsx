export function InputField(props) {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <label htmlFor={props.id} className="text-sm font-semibold">
        {props.label}
      </label>
      <Input {...props} />
    </div>
  )
}

export function Input(props) {
  return (
    <input
      {...props}
      className="border text-sm text-gray-600 bg-gray-50 shadow-sm border-gray-300 px-6 py-2 rounded-md focus:ring-1 focus:ring-blue-600 transition-all outline-none"
    />
  )
}
