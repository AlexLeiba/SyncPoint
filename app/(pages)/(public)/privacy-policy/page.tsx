import GridContainer from "@/components/Grid/GridContainer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function page() {
  return (
    <GridContainer>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="gradient-title">Privacy Policy</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
            exercitationem, velit blanditiis ad ipsam ratione at earum ea
            eligendi ipsum commodi odit nostrum atque impedit alias doloremque
            animi laborum vitae! Tempora sint nemo dignissimos quasi aperiam
            consectetur facere delectus, iure corporis! Unde sequi eaque illo
            nemo vel molestias nobis sed odio, pariatur tempora est. Quo
            voluptates cumque ducimus perspiciatis iusto autem accusantium
            architecto ea? Dolores eveniet voluptates molestiae expedita
            aliquid, provident doloribus debitis exercitationem nam suscipit ad,
            officiis facilis fugit totam unde repudiandae voluptate cupiditate
            quos dolorem quidem repellat. Ratione veritatis at aspernatur facere
            molestiae iusto animi ea laudantium soluta.
          </p>
        </div>
        <Link href="/">
          <Button>Back to home page</Button>
        </Link>
      </div>
    </GridContainer>
  );
}

export default page;
