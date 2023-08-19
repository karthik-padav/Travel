import SEO from "next.seo.config";

export const getSeoDetails = (data) => {
  const obj = { ...SEO };

  if (data?.title) {
    obj.openGraph.title = obj.title = `${data.title} | ${obj.title}`;
  }
  if (data?.description) {
    obj.openGraph.description = obj.description = data.description;
  }

  return obj;
};
