import React, { useState, useEffect } from "react";
import logo from "../logo/logo.png";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { withRouter } from "react-router-dom";

const PT_Menu = ({ title, links, history, path, type, page, element }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(page);
  const toggle = () => setIsOpen(!isOpen);
  const closeNavbar = () => setIsOpen(false);

  useEffect(() => {
    type !== "hash-tabs" &&
      setActiveItem(
        window.location.pathname.split("/")[
          window.location.pathname.split("/").length - 1
        ] == ""
          ? "home"
          : window.location.pathname.split("/")[
              window.location.pathname.split("/").length - 1
            ]
      );

    type == "hash-tabs" && setActiveItem(window.location.hash.split("#")[1]);
  }, [window.location.pathname]);

  const handleItemClick = (e, link) => {
    setActiveItem(link);
    if (link === "home") {
      history && history.push(path + "/");
    } else {
      const url =
        link.split(" ").join("-").split("'s").length > 1
          ? link.split(" ").join("-").split("'s-")[1].toLowerCase()
          : link.split(" ").join("-").split("'").join("").toLowerCase();
      type !== "hash-tabs" && history && history.push(path + "/" + url);
      if (type == "hash-tabs") window.location.hash = url;
    }
  };

  return (
    <div>
      {type === "navbar" && (
        <Navbar color="#000000" light expand="md">
          <NavbarBrand href="/">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/periodt-1584121712792.appspot.com/o/logo.png?alt=media&token=5a7c7880-9bb5-4f7d-9730-0b237574cb3b"
              width="100px"
            />
          </NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              {links.map((link) => {
                const url = link
                  .split(" ")
                  .join("-")
                  .split("'")
                  .join("")
                  .toLowerCase();

                return (
                  <NavItem key={link}>
                    <NavLink
                      active={url === activeItem}
                      onClick={(e) => {
                        closeNavbar();
                        handleItemClick(e, url);
                      }}
                    >
                      {link}
                    </NavLink>
                  </NavItem>
                );
              })}
            </Nav>
            {element}
          </Collapse>
        </Navbar>
      )}

      {type === "tabs" && (
        <>
          <Nav tabs>
            {links.map((link) => {
              const url = link
                .split(" ")
                .join("-")
                .split("'")
                .join("")
                .toLowerCase();
              return (
                <NavItem key={link}>
                  <NavLink
                    active={url === activeItem}
                    onClick={(e) => handleItemClick(e, url)}
                  >
                    {link}
                  </NavLink>
                </NavItem>
              );
            })}
          </Nav>
          {element}
        </>
      )}
      {type === "hash-tabs" && (
        <>
          <Nav tabs>
            {links.map((link) => {
              const url = link
                .split(" ")
                .join("-")
                .split("'")
                .join("")
                .toLowerCase();
              return (
                <NavItem key={link}>
                  <NavLink
                    active={url === activeItem}
                    onClick={(e) => handleItemClick(e, url)}
                  >
                    {link}
                  </NavLink>
                </NavItem>
              );
            })}
          </Nav>
          {element}
        </>
      )}
    </div>
  );
};

export default withRouter(PT_Menu);
