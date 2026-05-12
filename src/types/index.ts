interface backColor {
    color: "#FFFFFF" | "#212529" | "#FFD700",
    background: "#1A1A1B" | "#F8F9FA" | "#001F3F"

};

interface changeColor {
    id: number,
    color: backColor,
};

interface setBgImg {
    img: string
};