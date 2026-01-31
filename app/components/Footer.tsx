import contentHelper from "./../db/content-helper"

export default function Footer() {
    const footerContent = contentHelper.getFooterContent();

    return (
        <footer className="text-sm text-center text-gray-500 bg-gray-200 dark:bg-gray-800 p-4">
          <p>{footerContent.copyright}</p>
          <p>{footerContent.tagline}</p>
        </footer>
    )
}