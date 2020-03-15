import React, { useState } from "react";
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

  const handleItemClick = (e, link) => {
    // console.log(history);
    setActiveItem(link);
    history && history.push(path + "/" + link);
  };

  return (
    <div>
      {type === "navbar" && (
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">{title}</NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              {links.map(link => (
                <NavItem key={link}>
                  <NavLink
                    active={link === activeItem}
                    onClick={e => handleItemClick(e, link)}
                  >
                    {link[0].toUpperCase() + link.slice(1, link.length)}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
            {element}
          </Collapse>
        </Navbar>
      )}

      {type === "tabs" && (
        <>
          <Nav tabs>
            {links.map(link => (
              <NavItem key={link}>
                <NavLink
                  active={link === activeItem}
                  onClick={e => handleItemClick(e, link)}
                >
                  {link[0].toUpperCase() + link.slice(1, link.length)}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
          {element}
        </>
      )}
    </div>
  );
};

export default withRouter(PT_Menu);
