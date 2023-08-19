import constants from "@/utils/constants";
const site_name = constants.SITE_TITLE;
const title = constants.SITE_TITLE;
const description = constants.DESCRIPTION;

export default {
  title,
  description,
  canonical: constants.SITE_URL,
  additionalMetaTags: [],
  openGraph: {
    url: constants.SITE_URL,
    title,
    description,
    site_name,
  },
};
