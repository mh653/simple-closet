-- =========================================
-- バケット作成（public）
-- デモ画像4枚はGUIで追加
-- =========================================
insert into storage.buckets (id, name, public)
values ('clothes_image', 'clothes_image', true)
on conflict (id) do nothing;


-- 2/15 GUIからこの内容で追加
CREATE POLICY "allow upload qf0l9g_0" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'clothes_image');