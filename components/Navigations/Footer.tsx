import React from "react";
import GridContainer from "../Grid/GridContainer";
import { Logo } from "./Logo";
import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-accent ">
      <GridContainer spacerY="small">
        <div className="flex justify-between items-center">
          <Logo />

          <div className="flex gap-4">
            <Link
              href={"https://github.com/AlexLeiba"}
              target="_blank"
              title="Github"
            >
              <Github />
            </Link>

            <Link
              href={"mailto:leiba.alexandru@gmail.com"}
              target="_blank"
              title="Gmail"
            >
              <Mail />
            </Link>

            <Link
              href={"https://www.linkedin.com/in/alex-leiba-9205801ba/"}
              target="_blank"
              title="Linkedin"
            >
              <Linkedin />
            </Link>
          </div>
        </div>
      </GridContainer>
    </footer>
  );
}
