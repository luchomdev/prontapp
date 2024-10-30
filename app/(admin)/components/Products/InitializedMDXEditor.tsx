// InitializedMDXEditor.tsx
"use client"
import type { ForwardedRef } from 'react';
import {
    MDXEditor,
    directivesPlugin,
    AdmonitionDirectiveDescriptor,
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    tablePlugin,
    linkPlugin,
    linkDialogPlugin,
    imagePlugin,
    toolbarPlugin,
    diffSourcePlugin,
    DiffSourceToggleWrapper,
    UndoRedo,
    BoldItalicUnderlineToggles,
    InsertTable,
    CreateLink,
    InsertImage,
    ListsToggle,
    BlockTypeSelect,
    InsertAdmonition,
    InsertThematicBreak,
    CodeToggle,
    StrikeThroughSupSubToggles,
    type MDXEditorMethods,
    type MDXEditorProps
} from '@mdxeditor/editor';



interface InitializedMDXEditorProps extends MDXEditorProps {
    editorRef?: ForwardedRef<MDXEditorMethods>;
}

export default function InitializedMDXEditor({
    editorRef,
    ...props
}: InitializedMDXEditorProps) {
    return (
        <MDXEditor
            plugins={[
                directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor] }),
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
                tablePlugin(),
                linkPlugin(),
                linkDialogPlugin(),
                imagePlugin(),
                diffSourcePlugin(),
                toolbarPlugin({
                    toolbarContents: () => (
                        <DiffSourceToggleWrapper>
                            <UndoRedo />
                            <BoldItalicUnderlineToggles />
                            <CodeToggle />
                            <StrikeThroughSupSubToggles />
                            <ListsToggle />
                            <BlockTypeSelect />
                            <CreateLink />
                            <InsertImage />
                            <InsertTable />
                            <InsertThematicBreak />
                            <InsertAdmonition />
                        </DiffSourceToggleWrapper>
                    )
                })
            ]}
            {...props}
            ref={editorRef}
            contentEditableClassName="prose max-w-full min-h-[200px] px-4 py-2"
        />
    );
}