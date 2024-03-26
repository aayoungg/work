export default function CheckBox({ children, checked, setChecked, id }) {
  const onChange = (e) => {
    setChecked(e.target.checked);
  };

  return (
    <div>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        id={id}
        name={id}
      />
      <label htmlFor={id}>{children}</label>
    </div>
  );
}
