import { useState } from "react";
import {
  IconUserCircle,
  IconLogout,
  IconPlayerPlayFilled,
  IconSettings,
} from "@tabler/icons-react";
import { Group, Title, Box } from "@mantine/core";
import Image from "next/image";
import logo from "@/assets/logo.png";
import classes from "./styles.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

const data = [
  { link: "/play", label: "Play", icon: IconPlayerPlayFilled },
  { link: "/character", label: "Character", icon: IconUserCircle },
  { link: "/options", label: "Options", icon: IconSettings },
];

const InnerLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
  };

const Navbar = () => {
  const [active, setActive] = useState("Billing");

  const links = data.map((item) => (
    <Link
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={() => {
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} size={32} />
      <Title order={4}>{item.label}</Title>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <Image src={logo} width={1280} height={720} alt={"App Logo"} />
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
      <Box
        className={classes.link}
        onClick={handleLogout}
        style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
      >
      <IconLogout className={classes.linkIcon} stroke={1.5} size={32} />
        <Title order={4} ml={8}>
          Logout
        </Title>
      </Box>
      </div>
    </nav>
  );
  
};
  return (
    <>
      <Navbar />
      <Box>{children}</Box>
    </>
  );
}

export default InnerLayout;