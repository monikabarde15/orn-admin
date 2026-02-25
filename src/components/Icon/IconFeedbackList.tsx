import { FC } from 'react';

interface IconFeedbackListProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const IconFeedbackList: FC<IconFeedbackListProps> = ({ className, fill = false, duotone = true }) => {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M21 12C21 16.4183 16.9706 20 12 20C10.9676 20 9.97441 19.8555 9.04738 19.5894L4 21L5.4106 15.9526C4.85547 14.9744 4.5 13.8526 4.5 12C4.5 7.58172 8.52944 4 12 4C15.4706 4 21 7.58172 21 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <path
                opacity={duotone ? '0.5' : '1'}
                d="M9 11H15M9 14H13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
};

export default IconFeedbackList;
