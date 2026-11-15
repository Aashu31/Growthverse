import webDevImg from "../assets/growthverse/services/growthverse-service-website-development.webp";
import webAppImg from "../assets/growthverse/services/growthverse-service-web-application.webp";
import uiUxImg from "../assets/growthverse/services/growthverse-service-ui-ux.webp";
import mobileAppImg from "../assets/growthverse/services/growthverse-service-mobile-app.webp";
import aiImg from "../assets/growthverse/services/growthverse-service-ai-automation.webp";
import cloudImg from "../assets/growthverse/services/growthverse-service-cloud-devops.webp";
import brandingImg from "../assets/growthverse/services/growthverse-service-digital-branding.webp";
import marketingImg from "../assets/growthverse/services/growthverse-service-digital-marketing.webp";

export const SERVICE_IMAGES = {
  "website-development": webDevImg,
  "web-application-development": webAppImg,
  "ui-ux-design": uiUxImg,
  "mobile-application-development": mobileAppImg,
  "ai-and-automation": aiImg,
  "cloud-and-devops": cloudImg,
  "digital-branding": brandingImg,
  "digital-marketing": marketingImg,
};

export function getServiceImage(slug) {
  return SERVICE_IMAGES[slug] || null;
}
