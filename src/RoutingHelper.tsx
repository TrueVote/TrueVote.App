import { ReactNode } from 'react';
import { Link, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { emptyUserModel, useGlobalContext } from './Global';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { userModel } = useGlobalContext();
  const location = useLocation();
  console.info('location', location);

  if (userModel === emptyUserModel) {
    return <Navigate to='/signin' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

interface ProtectedLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

interface ProtectedNavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick: React.MouseEventHandler<HTMLAnchorElement>;
}

const useProtectedLink = (): any => {
  const { userModel } = useGlobalContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = (to: string): void => {
    if (userModel === emptyUserModel) {
      navigate('/signin', { state: { from: location }, replace: true });
    } else {
      navigate(to, { replace: true });
    }
  };

  return handleLinkClick;
};

interface ProtectedNavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const useProtectedNavLink = (): any => {
  const { userModel } = useGlobalContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = (to: string): void => {
    if (userModel === emptyUserModel) {
      navigate('/signin', { state: { from: location }, replace: true });
    } else {
      navigate(to, { replace: true });
    }
  };

  return handleLinkClick;
};

export const ProtectedLink: React.FC<ProtectedLinkProps> = ({
  to,
  children,
  className = '',
}: ProtectedLinkProps) => {
  const handleLinkClick = useProtectedLink();

  return (
    <Link to={to} className={className} onClick={() => handleLinkClick(to)}>
      {children}
    </Link>
  );
};

export const ProtectedNavLink: React.FC<ProtectedNavLinkProps> = ({
  to,
  children,
  className = '',
  onClick,
}: ProtectedNavLinkProps) => {
  const handleLinkClick = useProtectedNavLink();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    if (onClick) {
      onClick(event); // Call the onClick prop if it exists
    }
    handleLinkClick(to); // Call the handleLinkClick function
  };

  return (
    <NavLink
      to={to}
      className={className}
      onClick={(event: React.MouseEvent<HTMLAnchorElement>) => handleClick(event)}
    >
      {children}
    </NavLink>
  );
};
