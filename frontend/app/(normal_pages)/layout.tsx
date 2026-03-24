import MainLayout from "@/components/main-layout/main-layout";

export default function NormalPagesLayout({ children }: { children: React.ReactNode }) {
    return <MainLayout>{children}</MainLayout>;
}