-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for creations
CREATE POLICY "Users can view own creations"
  ON creations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own creations"
  ON creations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own creations"
  ON creations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own creations"
  ON creations FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for creation_stats
CREATE POLICY "Users can view own creation stats"
  ON creation_stats FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM creations
      WHERE creations.id = creation_stats.creation_id
      AND creations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own creation stats"
  ON creation_stats FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM creations
      WHERE creations.id = creation_stats.creation_id
      AND creations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own creation stats"
  ON creation_stats FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM creations
      WHERE creations.id = creation_stats.creation_id
      AND creations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own creation stats"
  ON creation_stats FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM creations
      WHERE creations.id = creation_stats.creation_id
      AND creations.user_id = auth.uid()
    )
  );
