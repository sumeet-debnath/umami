// A toast's message that shows "Saved." as before and names what was saved for assistive
// technology and agents ("Note saved"), in visually hidden text. The toast's own type takes a
// string; it renders any node.
export function savedToastMessage(shown: string, spoken: string) {
  return (
    <>
      <span aria-hidden="true">{shown}</span>
      <span className="sr-only">{spoken}</span>
    </>
  ) as unknown as string;
}
