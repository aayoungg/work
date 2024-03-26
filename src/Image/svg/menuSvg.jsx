function MenuSvg({ color }) {

    return (
        <div style={{
            display: "flex", padding: "0px 15px"
        }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_436_2131)">
                    <path d="M11 11H13H19V13H13H11H5V11H11Z" fill={color} />
                </g>
                <defs>
                    <clipPath id="clip0_436_2131">
                        <rect width="24" height="24" />
                    </clipPath>
                </defs>
            </svg>
        </div >
    );
}

export default MenuSvg;