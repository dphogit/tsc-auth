import React, { useRef } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MoreIcon from "@material-ui/icons/MoreVert";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PeopleIcon from "@material-ui/icons/People";
import { Link, useHistory } from "react-router-dom";
import NavigationItem from "./NavigationItem";
import MobileItem from "./MobileItem";

import useStyles from "./styles";

interface Props {
  userId: number;
  logout: () => void;
}

const Navigation = ({ userId, logout }: Props) => {
  const classes = useStyles();

  const history = useHistory();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleUsersMenuClick = () => {
    history.push("/users");
    handleMenuClose();
  };

  const handleProfileMenuClick = () => {
    history.push(`/users/${userId}`);
    handleMenuClose();
  };

  // Desktop Specific Display For Menu
  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <Link to={`/users/${userId}`} className={classes.menuLink}>
          My Profile
        </Link>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Link to="/users" className={classes.menuLink}>
          Users
        </Link>
      </MenuItem>
      <MenuItem onClick={logout}>Logout</MenuItem>
    </Menu>
  );

  // Mobile Responsive Specific Display For Menu
  const mobileMenuId = "primary-search-account-menu-mobile";
  const peopleMobileRef = useRef<HTMLLIElement>(null!);
  const accountCircleMobileRef = useRef<HTMLLIElement>(null!);
  const logoutMobileRef = useRef<HTMLLIElement>(null!);

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MobileItem
        onClick={handleUsersMenuClick}
        ariaControls="primary-view-user-profiles-menu"
        ariaLabel="view all other user profiles"
        text="Users"
        iconComponent={<PeopleIcon />}
        ref={peopleMobileRef}
      />
      <MobileItem
        onClick={handleProfileMenuClick}
        ariaControls="primary-view-my-profile-menu"
        ariaLabel="view my own profile"
        text="Profile"
        iconComponent={<AccountCircle />}
        ref={accountCircleMobileRef}
      />
      <MobileItem
        onClick={logout}
        ariaControls="primary-logout-menu"
        ariaLabel="log user out"
        text="Logout"
        iconComponent={<ExitToAppIcon />}
        ref={logoutMobileRef}
      />
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            Authentication App
          </Typography>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <NavigationItem path="/users" text="Users" />
            <NavigationItem path={`users/${userId}`} text="My Profile" />
            <NavigationItem path="/" text="Logout" onClick={logout} />
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
};

export default Navigation;
