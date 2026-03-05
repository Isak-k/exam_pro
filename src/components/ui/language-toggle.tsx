import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

const USFlag = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 480"
    className="h-4 w-6 object-cover rounded-sm"
    aria-hidden="true"
  >
    <path fill="#bd3d44" d="M0 0h640v480H0" />
    <path
      stroke="#fff"
      strokeWidth="37"
      d="M0 55.3h640M0 129h640M0 202.8h640M0 276.5h640M0 350.2h640M0 423.9h640"
    />
    <path fill="#192f5d" d="M0 0h296v258.5H0" />
    <marker id="us-a" markerHeight="30" markerWidth="30">
      <path fill="#fff" d="m14.7 0 4.6 14.1L5 4.8h19.4L10.1 14.1z" />
    </marker>
    <use width="30" height="30" x="19" y="10" xlinkHref="#us-a" />
    <use width="30" height="30" x="48" y="10" xlinkHref="#us-a" />
    <use width="30" height="30" x="77" y="10" xlinkHref="#us-a" />
    <use width="30" height="30" x="106" y="10" xlinkHref="#us-a" />
    <use width="30" height="30" x="135" y="10" xlinkHref="#us-a" />
    <use width="30" height="30" x="164" y="10" xlinkHref="#us-a" />
    <use width="30" height="30" x="193" y="10" xlinkHref="#us-a" />
    <use width="30" height="30" x="222" y="10" xlinkHref="#us-a" />
    <use width="30" height="30" x="251" y="10" xlinkHref="#us-a" />
    <use width="30" height="30" x="34" y="35" xlinkHref="#us-a" />
    <use width="30" height="30" x="63" y="35" xlinkHref="#us-a" />
    <use width="30" height="30" x="92" y="35" xlinkHref="#us-a" />
    <use width="30" height="30" x="121" y="35" xlinkHref="#us-a" />
    <use width="30" height="30" x="150" y="35" xlinkHref="#us-a" />
    <use width="30" height="30" x="179" y="35" xlinkHref="#us-a" />
    <use width="30" height="30" x="208" y="35" xlinkHref="#us-a" />
    <use width="30" height="30" x="237" y="35" xlinkHref="#us-a" />
    <use width="30" height="30" x="19" y="60" xlinkHref="#us-a" />
    <use width="30" height="30" x="48" y="60" xlinkHref="#us-a" />
    <use width="30" height="30" x="77" y="60" xlinkHref="#us-a" />
    <use width="30" height="30" x="106" y="60" xlinkHref="#us-a" />
    <use width="30" height="30" x="135" y="60" xlinkHref="#us-a" />
    <use width="30" height="30" x="164" y="60" xlinkHref="#us-a" />
    <use width="30" height="30" x="193" y="60" xlinkHref="#us-a" />
    <use width="30" height="30" x="222" y="60" xlinkHref="#us-a" />
    <use width="30" height="30" x="251" y="60" xlinkHref="#us-a" />
    <use width="30" height="30" x="34" y="85" xlinkHref="#us-a" />
    <use width="30" height="30" x="63" y="85" xlinkHref="#us-a" />
    <use width="30" height="30" x="92" y="85" xlinkHref="#us-a" />
    <use width="30" height="30" x="121" y="85" xlinkHref="#us-a" />
    <use width="30" height="30" x="150" y="85" xlinkHref="#us-a" />
    <use width="30" height="30" x="179" y="85" xlinkHref="#us-a" />
    <use width="30" height="30" x="208" y="85" xlinkHref="#us-a" />
    <use width="30" height="30" x="237" y="85" xlinkHref="#us-a" />
    <use width="30" height="30" x="19" y="110" xlinkHref="#us-a" />
    <use width="30" height="30" x="48" y="110" xlinkHref="#us-a" />
    <use width="30" height="30" x="77" y="110" xlinkHref="#us-a" />
    <use width="30" height="30" x="106" y="110" xlinkHref="#us-a" />
    <use width="30" height="30" x="135" y="110" xlinkHref="#us-a" />
    <use width="30" height="30" x="164" y="110" xlinkHref="#us-a" />
    <use width="30" height="30" x="193" y="110" xlinkHref="#us-a" />
    <use width="30" height="30" x="222" y="110" xlinkHref="#us-a" />
    <use width="30" height="30" x="251" y="110" xlinkHref="#us-a" />
    <use width="30" height="30" x="34" y="135" xlinkHref="#us-a" />
    <use width="30" height="30" x="63" y="135" xlinkHref="#us-a" />
    <use width="30" height="30" x="92" y="135" xlinkHref="#us-a" />
    <use width="30" height="30" x="121" y="135" xlinkHref="#us-a" />
    <use width="30" height="30" x="150" y="135" xlinkHref="#us-a" />
    <use width="30" height="30" x="179" y="135" xlinkHref="#us-a" />
    <use width="30" height="30" x="208" y="135" xlinkHref="#us-a" />
    <use width="30" height="30" x="237" y="135" xlinkHref="#us-a" />
    <use width="30" height="30" x="19" y="160" xlinkHref="#us-a" />
    <use width="30" height="30" x="48" y="160" xlinkHref="#us-a" />
    <use width="30" height="30" x="77" y="160" xlinkHref="#us-a" />
    <use width="30" height="30" x="106" y="160" xlinkHref="#us-a" />
    <use width="30" height="30" x="135" y="160" xlinkHref="#us-a" />
    <use width="30" height="30" x="164" y="160" xlinkHref="#us-a" />
    <use width="30" height="30" x="193" y="160" xlinkHref="#us-a" />
    <use width="30" height="30" x="222" y="160" xlinkHref="#us-a" />
    <use width="30" height="30" x="251" y="160" xlinkHref="#us-a" />
    <use width="30" height="30" x="34" y="185" xlinkHref="#us-a" />
    <use width="30" height="30" x="63" y="185" xlinkHref="#us-a" />
    <use width="30" height="30" x="92" y="185" xlinkHref="#us-a" />
    <use width="30" height="30" x="121" y="185" xlinkHref="#us-a" />
    <use width="30" height="30" x="150" y="185" xlinkHref="#us-a" />
    <use width="30" height="30" x="179" y="185" xlinkHref="#us-a" />
    <use width="30" height="30" x="208" y="185" xlinkHref="#us-a" />
    <use width="30" height="30" x="237" y="185" xlinkHref="#us-a" />
    <use width="30" height="30" x="19" y="210" xlinkHref="#us-a" />
    <use width="30" height="30" x="48" y="210" xlinkHref="#us-a" />
    <use width="30" height="30" x="77" y="210" xlinkHref="#us-a" />
    <use width="30" height="30" x="106" y="210" xlinkHref="#us-a" />
    <use width="30" height="30" x="135" y="210" xlinkHref="#us-a" />
    <use width="30" height="30" x="164" y="210" xlinkHref="#us-a" />
    <use width="30" height="30" x="193" y="210" xlinkHref="#us-a" />
    <use width="30" height="30" x="222" y="210" xlinkHref="#us-a" />
    <use width="30" height="30" x="251" y="210" xlinkHref="#us-a" />
  </svg>
);

const ETFlag = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 800"
    className="h-4 w-6 object-cover rounded-sm"
    aria-hidden="true"
  >
    <path fill="#078930" d="M0 0h1200v800H0z" />
    <path fill="#FCDD09" d="M0 266.7h1200v533.3H0z" />
    <path fill="#DA121A" d="M0 533.3h1200V800H0z" />
    <circle cx="600" cy="400" r="200" fill="#0F47AF" />
    <path
      fill="#FCDD09"
      d="M600 240l47 144.7 152.3 22.3-110.3 107.3 26 151.7L600 594l-115 72 26-151.7L400.7 407l152.3-22.3z"
    />
    <path
      fill="#0F47AF"
      d="M600 280l-35.3 108.7-114.3 16.7 82.7 80.3-19.7 113.7L600 546l86.7 53.3-19.7-113.7 82.7-80.3-114.3-16.7z"
    />
    <path
      fill="#FCDD09"
      d="M600 240l-7.7 23.3 15.3 0zm47 144.7l-22.3 7 13 18zm152.3 22.3l-24.3-1.3 7.7 23zm-110.3 107.3l-5.3 23.7 23.3-6.7zm26 151.7l-15.3-19 24.3-1.3zm-115-72l20.7-13 3.3 24.3zm-115 72l-9-22.7 24.3 1.3zm26-151.7l5.3 23.7 23.3 6.7zm-110.3-107.3l24.3-1.3-15-18zm152.3-22.3l-22.3-7 7.7-23.3z"
    />
  </svg>
);

export function LanguageToggle() {
  const { i18n } = useTranslation();

  // Use resolvedLanguage to get the actual language being used
  const currentLang = i18n.resolvedLanguage || i18n.language || "en";

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const getFlag = (lang: string) => {
    if (lang === "om" || lang === "am") return <ETFlag />;
    return <USFlag />; // Default to US flag for English
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 px-0 hover:bg-muted">
          <span className="flex items-center justify-center">{getFlag(currentLang)}</span>
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage("en")} className="gap-2 cursor-pointer">
          <USFlag /> English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("om")} className="gap-2 cursor-pointer">
          <ETFlag /> Afaan Oromoo
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("am")} className="gap-2 cursor-pointer">
          <ETFlag /> አማርኛ
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
