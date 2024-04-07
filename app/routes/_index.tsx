import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Youtube" },
    {
      name: "Youtube",
      content: "This will try to replicate some stuff from Youtube!",
    },
  ];
};

export default function Index() {
  return <h1 className="text-3xl font-bold underline">Hello world!</h1>;
}
