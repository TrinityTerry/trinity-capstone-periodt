import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import { withRouter } from "react-router-dom";

const PT_Menu = ({ title, links, history, path, type, page, element }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(page);
  const toggle = () => setIsOpen(!isOpen);
  const closeNavbar = () => setIsOpen(false);

  const handleItemClick = (e, link) => {
    setActiveItem(link);
    if (link === "home") {
      history && history.push(path + "/");
    } else {
      const url =
        link
          .split(" ")
          .join("-")
          .split("'s").length > 1
          ? link
              .split(" ")
              .join("-")
              .split("'s-")[1]
              .toLowerCase()
          : link
              .split(" ")
              .join("-")
              .split("'")
              .join("")
              .toLowerCase();
      history && history.push(path + "/" + url);
    }
  };

  return (
    <div>
      {type === "navbar" && (
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">{title}</NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              {links.map(link => {
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
                      onClick={e => {
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
            {links.map(link => {
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
                    onClick={e => handleItemClick(e, url)}
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
