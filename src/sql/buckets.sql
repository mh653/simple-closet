-- =========================================
-- バケット作成（public）
-- デモ画像4枚はGUIで追加
-- =========================================
insert into storage.buckets (id, name, public)
values ('clothes_image', 'clothes_image', true)
on conflict (id) do nothing;
